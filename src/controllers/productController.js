
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
    const price_range = req.query["price-range"]
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
        }
    ]

    // Filtro de categorias
    if (category_ids) {
        const categoryIds = category_ids.split(",").map(Number)

        if (
            categoryIds.some(id => !Number.isInteger(id) || id <= 0)
        ) {
            return res.status(400).json({
                msg: "IDs de categorias inválidos"
            })
        }

        include.push({
            association: "categories",
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
    } else {
        include.push({
            association: "categories",
            through: {
                attributes: []
            },
            required: false
        })
    }

    // Filtro de opções
    const optionInclude = {
        association: "options",
        attributes: [
            "id",
            "title",
            "shape",
            "radius",
            "type",
            "values"
        ],
        required: Boolean(options)
    }

    if (options) {
        const optionFilters = Object.entries(options).map(([id, values]) => {
            const selectedValues = values.split(",")

            return {
                id: Number(id),
                [Op.or]: selectedValues.map(value =>
                    sequelize.where(
                        sequelize.fn(
                            "JSON_CONTAINS",
                            sequelize.col("options.values"),
                            JSON.stringify(value)
                        ),
                        1
                    )
                )
            }
        })

        optionInclude.where = {
            [Op.or]: optionFilters
        }
    }

    include.push(optionInclude)

    const where = {}

    if (match) {
        where[Op.or] = [
            { name: { [Op.like]: `%${match}%` } },
            { description: { [Op.like]: `%${match}%` } }
        ]
    }

    // Filtro de preço
    if (price_range) {
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
        return res.status(500).json({
            msg: "Erro ao buscar produtos",
            error: error.message
        })
    }
}

const findById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            attributes: [
                "id",
                "enabled",
                "name",
                "slug",
                "stock",
                "description",
                "price",
                "price_with_discount"
            ],
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
            ]
        })

        if (!product) {
            return res.status(404).json({
                msg: "Produto não encontrado"
            })
        }

        const categoryIds = product.categories.map(category => category.id)

        const response = {
            ...product.toJSON(),
            category_ids: categoryIds
        }

        delete response.categories

        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            msg: "Erro ao buscar produto",
            error: error.message
        })
    }
}

const create = async (req, res) => {
    const transaction = await sequelize.transaction()

    try {
        const { category_ids, ...body } = req.body

        if (
            category_ids !== undefined &&
            !Array.isArray(category_ids)
        ) {
            throw new Error("category_ids deve ser um array")
        }

        const product = await Product.create(body, {
            include: [
                { association: "images" },
                { association: "options" }
            ],
            transaction
        })

        let categoryIds = []

        if (category_ids !== undefined && category_ids.length) {
            const categories = await Category.findAll({
                where: {
                    id: {
                        [Op.in]: category_ids
                    }
                },
                transaction
            })

            if (categories.length !== new Set(category_ids).size) {
                throw new Error(
                    "Uma ou mais categorias não foram encontradas"
                )
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

        await sequelize.transaction(async (transaction) => {
            const product = await Product.findByPk(req.params.id, {
                transaction
            })

            if (!product) {
                const error = new Error("Produto não encontrado")
                error.status = 404
                throw error
            }

            await product.update(body, { transaction })

            // Atualização de imagens
            if (images !== undefined) {
                if (!Array.isArray(images)) {
                    const error = new Error("images deve ser um array")
                    error.status = 400
                    throw error
                }

                await ImageProduct.destroy({
                    where: { product_id: product.id },
                    transaction
                })

                if (images.length) {
                    await ImageProduct.bulkCreate(
                        images.map(image => ({
                            ...image,
                            product_id: product.id
                        })),
                        { transaction }
                    )
                }
            }

            // Atualização de opções
            if (options !== undefined) {
                if (!Array.isArray(options)) {
                    const error = new Error("options deve ser um array")
                    error.status = 400
                    throw error
                }

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

            // Atualização de categorias
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
                    const error = new Error(
                        "Uma ou mais categorias não foram encontradas"
                    )
                    error.status = 404
                    throw error
                }

                await product.setCategories(categories, { transaction })
            }
        })

        return res.status(204).end()

    } catch (error) {
        return res.status(error.status || 400).json({
            msg: "Erro ao editar dados do produto",
            error: error.message
        })
    }
}

const remove = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id)

        if (!product) {
            return res.status(404).json({
                msg: "Produto não encontrado"
            })
        }

        await product.destroy()

        return res.status(204).end()

    } catch (error) {
        return res.status(500).json({
            msg: "Erro ao excluir produto",
            error: error.message
        })
    }
}

export {
    search,
    findById,
    create,
    update,
    remove
}
