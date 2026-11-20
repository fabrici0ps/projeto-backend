import express from "express"
import { create, findById, remove, search, update } from "../controllers/categoryController.js"

const categoryRoutes = express.Router()

categoryRoutes.route("/v1/category/search").get(search)
categoryRoutes.route("/v1/category/:id").get(findById).put(update).delete(remove)
categoryRoutes.route("/v1/category").post(create)

export default categoryRoutes