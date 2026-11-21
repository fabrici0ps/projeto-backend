import express from "express"
import { create, findById, remove, search, update } from "../controllers/productController.js"

const productRoutes = express.Router()

productRoutes.route("/v1/product/search").get(search)
productRoutes.route("/v1/product/:id").get(findById).put(update).delete(remove)
productRoutes.route("/v1/product").post(create)

export default productRoutes