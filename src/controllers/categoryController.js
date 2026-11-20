import Category from "../models/categoryModel.js"

const search = async (req, res) => {
    const limit = Number(req.query.limit ?? 12)
    const page = Number(req.query.page ?? 1)
    const fields = req.query.fields
    const use_in_menu = req.query.use_in_menu

    const offset = limit === -1 ? undefined : (page - 1) * limit

    const attributes = fields
        ? ["id", ...fields.split(",")]
        : ["id", "name", "slug", "use_in_menu"]

    const where = {}

    if (use_in_menu !== undefined) {
        where.use_in_menu = use_in_menu === "true"
    }

    try {
        const categories = await Category.findAndCountAll({
            attributes,
            where,
            limit: limit === -1 ? undefined : limit,
            offset
        })

        return res.status(200).json({
            data: categories.rows,
            total: categories.count,
            limit,
            page
        })
    } catch (error) {
        return res.status(404).json({ msg: "Dados incorretos" })
    }
}

const findById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id)

        if(!category) return res.status(404).json({ msg: "Categoria não encontrada" })

        return res.status(200).json(category)
    } catch (error) {
        return res.json({ error: error.message })
    }
}

const create = async (req, res) => {
    try {
        const body = req.body

        const category = await Category.create(body)
        return res.status(201).json({ category })
        
    } catch (error) {
        return res.status(400).json({ msg: "Dados enviados incorretos", error: error.message })
    }
}

const update = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id)

        if(!category) return res.status(404).json({ msg: "Categoria não encontrada" })

        const { name, slug, use_in_menu } = req.body

        await category.update({ name, slug, use_in_menu })

        return res.status(204).end()
    } catch (error) {
        return res.status(400).json({ msg: "Erro ao editar dados da categoria", error: error.message })
    }
}

const remove = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id)

        await category.destroy()
        
        return res.status(204).end()
    } catch (error) {
        return res.status(404).json({ msg: "Categoria não encontrada", error: error.message })
    }
}

export {
    search,
    findById,
    create,
    update,
    remove
}