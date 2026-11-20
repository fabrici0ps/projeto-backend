import bcrypt from "bcrypt"
import User from "../models/userModel.js"

const findById = async (req, res) => {    
    try {
        const user = await User.findByPk(req.params.id, 
            {
                attributes: ['id', 'firstname', 'surname', 'email']
            })
        return res.status(200).json({ user })
        
    } catch (error) {
        return res.status(404).json({ msg: "Usuário não encontrado", error })
    }
}

const create = async (req, res) => {
    try {
        const body = req.body
        body.password = await bcrypt.hash(body.password, 10)

        const user = await User.create(body)
        return res.status(201).json({ user })
        
    } catch (error) {
        return res.status(400).json({ msg: "Dados enviados incorretos", error: error.message })
    }
}

const update = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id)

        if(!user) return res.status(404).json({ msg: "Usuário não encontrado" })

        const { name, email, password } = req.body

        await user.update({ name, email, password })

        return res.status(204).end()
    } catch (error) {
        return res.status(400).json({ msg: "Erro ao editar dados do usuário", error: error.message })
    }
}

const remove = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id)

        await user.destroy()
        
        return res.status(204).end()
    } catch (error) {
        return res.status(404).json({ msg: "Usuário não encontrado", error: error.message })
    }
}

export {
    findById,
    create,
    update,
    remove
}