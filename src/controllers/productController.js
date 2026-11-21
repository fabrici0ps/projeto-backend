import { Op } from "sequelize"
import Product from "../models/productModel.js"
import Category from "../models/categoryModel.js"
import OptionsProduct from "../models/optionsProductModel.js"
import ImageProduct from "../models/imageProductModel.js"
import { sequelize } from "../config/connection.js"

const search = async (req, res) => {
    const limit = Number(req.query.limit ?? 12)
    const page = Number(req.query.page ?? 1)
    const fields = req.query.fields
    const match = req.query.match
    const category_ids = req.query.category_ids
    const price_range = req.query.price_range
    const options = req.query.option

    if (
        !Number.isInteger(limit) ||
        (limit !== -1 && limit <= 0) ||
        !Number.isInteger(page) ||
        page <= 0
    ) {
        return res.status(400).json({
            msg: "Parâmetros de paginação inválidos"
        })
    }

    const pagination = limit === -1 
        ? {} 
        : {
            limit,
            offset: (page - 1) * limit
        }

    const attributes = fields
        ? ["id", ...fields.split(",")]
        : undefined
    
    const include = [
        {
            association: "images",
            attributes: ["id", "path"],
            required: false
        },
        {
            association: "options",
            attributes: [
                "id",
                "title",
                "shape",
                "radius",
                "type",
                "values"
            ],
            required: false
        }
    ]

    if(category_ids) {
        const categoryIds = category_ids.split(",").map(Number)

        include.push({
            model: Category,
            where: {
                id: {
                    [Op.in]: categoryIds
                }
            },
            through: {
                attributes: []
            },
            required: true
        })
    }


    if (options) {
        for (const [id, values] of Object.entries(options)) {
            const selectedValues = values.split(",")

            include.push({
                model: OptionsProduct,
                where: {
                    id: Number(id),
                    [Op.or]: selectedValues.map(value =>
                        sequelize.where(
                            sequelize.fn(
                                "JSON_CONTAINS",
                                sequelize.col("OptionsProduct.values"),
                                JSON.stringify(value)
                            ),
                            1
                        )
                    )
                },
                required: false
            })
        }
    }

    const where = {}
    
    if (match) {
        where[Op.or] = [
            { name: {[Op.like]: `%${match}%`} },
            { description: {[Op.like]: `%${match}%`} }
        ]
    }
    
    if(price_range) {
        const [minPrice, maxPrice] = price_range.split("-").map(Number)

        if (
            !Number.isFinite(minPrice) ||
            !Number.isFinite(maxPrice) ||
            minPrice < 0 ||
            minPrice > maxPrice
        ) {
            return res.status(400).json({
                msg: "Intervalo de preços inválido"
            })
        }

        where.price = {
            [Op.between]: [minPrice, maxPrice]
        }
    }


    try {
        const products = await Product.findAndCountAll({
            attributes,
            where,
            include,
            ...pagination,
            distinct: true
        })

        return res.status(200).json({
            data: products.rows,
            total: products.count,
            limit,
            page
        })
    } catch (error) {
        return res.status(400).json({ msg: "Dados incorretos", error: error.message })
    }
}

const findById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            attributes: ["id","enabled","name","slug","stock","description","price","price_with_discount"],
            include: [
                {association: "categories", through: {attributes: []}},
                {association: "images", attributes: ["id", "path"]},
                {association: "options", attributes: ["id", "title", "values"]}
            ]
        })

        if(!product) return res.status(404).json({ msg: "Produto não encontrado" })

        const categoryIds = product.categories.map(category => category.id)

        const response = {
            ...product.toJSON(),
            category_ids: categoryIds
        }

        delete response.categories

        return res.status(200).json(response)
    } catch (error) {
        return res.json({ error: error.message })
    }
}

const create = async (req, res) => {
    const transaction = await sequelize.transaction()

    try {
        const { category_ids, ...body } = req.body

        const product = await Product.create(body, {
            include: [
                { 
                    association: "images", 
                    attributes: ["id", "path"] 
                },
                { 
                    association: "options",
                    attributes: [
                        "id",
                        "title",
                        "shape",
                        "radius",
                        "type",
                        "values"
                    ]
                }

            ],
            transaction
        })

        let categoryIds = []

        if (category_ids?.length) {
            const categories = await Category.findAll({
                where: {
                    id: {
                        [Op.in]: category_ids
                    }
                },
                transaction
            })

            if (categories.length !== category_ids.length) {
                throw new Error("Uma ou mais categorias não foram encontradas")
            }

            await product.setCategories(categories, { transaction })

            categoryIds = categories.map(category => category.id)
        }

        await transaction.commit()

        return res.status(201).json({
            ...product.toJSON(),
            category_ids: categoryIds
        })
        
    } catch (error) {
        await transaction.rollback()

        return res.status(400).json({ 
            msg: "Dados enviados incorretos", 
            error: error.message 
        })
    }
}

const update = async (req, res) => {
    try {
        const { 
            category_ids,
            images,
            options,
            ...body
        } = req.body

        const response = await sequelize.transaction(async (transaction) => {
            const product = await Product.findByPk(req.params.id, {transaction})

            if(!product) return res.status(404).json({ msg: "Produto não encontrado" })
            
            await product.update(body, {transaction})

            if(images !== undefined) {
                await ImageProduct.destroy({
                    where: { product_id: product.id },
                    transaction
                })

                if(images.length) {
                    await ImageProduct.bulkCreate(
                        images.map(image => ({
                            ...image,
                            product_id: product.id
                        })),
                        {transaction}
                    )
                }
            }

            if (options !== undefined) {
                await OptionsProduct.destroy({
                    where: { product_id: product.id },
                    transaction
                })

                if (options.length) {
                    await OptionsProduct.bulkCreate(
                        options.map(option => ({
                            ...option,
                            product_id: product.id
                        })),
                        { transaction }
                    )
                }
            }

            if (category_ids !== undefined) {
                if (!Array.isArray(category_ids)) {
                    const error = new Error("category_ids deve ser um array")
                    error.status = 400
                    throw error
                }

                const categories = await Category.findAll({
                    where: {
                        id: {
                            [Op.in]: category_ids
                        }
                    },
                    transaction
                })

                if (categories.length !== new Set(category_ids).size) {
                    const error = new Error("Uma ou mais categorias não foram encontradas")
                    error.status = 404
                    throw error
                }

                await product.setCategories(categories, { transaction })
            }

            const updatedProduct = await Product.findByPk(product.id, {
                include: [
                    {
                        association: "categories",
                        through: { attributes: [] }
                    },
                    {
                        association: "images",
                        attributes: ["id", "path"]
                    },
                    {
                        association: "options",
                        attributes: [
                            "id",
                            "title",
                            "shape",
                            "radius",
                            "type",
                            "values"
                        ]
                    }
                ],
                transaction
            })

            const data = updatedProduct.toJSON()

            const categoryIds = data.categories.map(category => category.id)

            delete data.categories

            return {
                ...data,
                category_ids: categoryIds
            }
        })

        return res.status(204).end()
    } catch (error) {
        return res.status(400).json({ msg: "Erro ao editar dados do produto", error: error.message })
    }
}

const remove = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id)

        await product.destroy()
        
        return res.status(204).end()
    } catch (error) {
        return res.status(404).json({ msg: "Produto não encontrado", error: error.message })
    }
}

export {
    search,
    findById,
    create,
    update,
    remove
}