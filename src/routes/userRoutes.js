import express from "express"
import { findById, create, update, remove, generateToken } from "../controllers/userController.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const userRoutes = express.Router()

userRoutes.route("/v1/user/:id")
userRoutes.route("/v1/user/:id").get(findById).put(authMiddleware, update).delete(authMiddleware, remove)
userRoutes.route("/v1/user").post(create)
userRoutes.route("/v1/user/token").post(generateToken)

export default userRoutes