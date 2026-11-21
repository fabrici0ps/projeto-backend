import express from "express"
import { create, findById, remove, search, update } from "../controllers/categoryController.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const categoryRoutes = express.Router()

categoryRoutes.route("/v1/category/search").get(search)
categoryRoutes.route("/v1/category/:id").get(findById).put(authMiddleware, update).delete(authMiddleware, remove)
categoryRoutes.route("/v1/category").post(authMiddleware, create)

export default categoryRoutes