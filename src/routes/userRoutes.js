import express from "express"
import { findById, create, update, remove } from "../controllers/userController.js"

const userRoutes = express.Router()

userRoutes.route("/v1/users/:id").get(findById).put(update).delete(remove)
userRoutes.route("/v1/users").post(create)

export default userRoutes