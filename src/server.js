import express from "express"
import swaggerUi from "swagger-ui-express"

import "./models/relations.js"
import { connect } from "./config/connection.js"
import swaggerSpec from "./config/swagger.js"

import userRoutes from "./routes/userRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"

const app = express()
const port = 3000

app.use(express.json())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(userRoutes, categoryRoutes, productRoutes)

connect()

app.listen(port, () => {
    console.log("Server running on port:", port)
})