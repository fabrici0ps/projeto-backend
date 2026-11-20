import express from "express"
import "./models/relations.js"
import { connect } from "./config/connection.js"
import userRoutes from "./routes/userRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"

const app = express()
const port = 3000

app.use(express.json())
app.use(userRoutes, categoryRoutes)

connect()

app.listen(port, () => {
    console.log("Server running on port:", port)
})