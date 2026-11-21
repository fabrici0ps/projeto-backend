import jwt from "jsonwebtoken"

const authMiddleware = async (req, res, next) => {
    const authorization = req.headers.authorization

    if (!authorization) {
        return res.status(401).json({ msg: "Token ausente" })
    }

    const [bearer, token] = authorization.split(" ")

    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({
            msg: "Formato de token inválido"
        })
    }

    try {
        req.user = jwt.verify(token, process.env.APP_SECRET_KEY)
    } catch (error) {
        return res.status(401).json({msg: "Token expirado ou inválido", error: error.message})
    }
    
    next()
}

export default authMiddleware