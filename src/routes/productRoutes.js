import express from "express"
import { create, findById, remove, search, update } from "../controllers/productController.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const productRoutes = express.Router()

productRoutes.route("/v1/product/search").get(search)
productRoutes.route("/v1/product/:id").get(findById).put(authMiddleware, update).delete(authMiddleware, remove)
productRoutes.route("/v1/product").post(authMiddleware, create)

export default productRoutes