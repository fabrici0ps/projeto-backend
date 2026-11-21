import bcrypt from "bcrypt"
import User from "../models/userModel.js"
import jwt from "jsonwebtoken"

const generateToken = async (req, res) => {
    const { email, password } = req.body
    
    try {
        const user = await User.findOne({ where: { email: email } })

        if(!user) return res.status(404).json({ msg: "Usuário não encontrado" })

        const matchPassword = await bcrypt.compare(password, user.password)

        if(!matchPassword) return res.status(400).json({ msg: "Senha incorreta" })
        
            const payload = {
                id: user.id,
                firstname: user.firstname,
                email: email
            }

        const token = jwt.sign(
            payload, 
            process.env.APP_SECRET_KEY, 
            { expiresIn: "1h" }
        )

        return res.status(200).json({token: token})
    } catch (error) {
        return res.status(400).json({ msg: "Os dados fornecidos estão incorretos", error: error.message })
    }
}

const findById = async (req, res) => {    
    try {
        const user = await User.findByPk(req.params.id, 
            {
                attributes: ['id', 'firstname', 'surname', 'email']
            })

        if(!user) return res.status(404).json({ msg: "Usuário não encontrado" })
            
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

        const userResponse = user.toJSON()
        delete userResponse.password

        return res.status(201).json({ user: userResponse })
        
    } catch (error) {
        return res.status(400).json({ msg: "Dados enviados incorretos", error: error.message })
    }
}

const update = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id)

        if(!user) return res.status(404).json({ msg: "Usuário não encontrado" })

        const { firstname, surname, email } = req.body

        await user.update({ firstname, surname, email })

        return res.status(204).end()
    } catch (error) {
        return res.status(400).json({ msg: "Erro ao editar dados do usuário", error: error.message })
    }
}

const remove = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id)

        if(!user) return res.status(404).json({ msg: "Usuário não encontrado" })

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
    remove,
    generateToken
}