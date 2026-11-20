import "dotenv/config"
import { Sequelize } from "sequelize"

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: 'localhost',
        dialect: 'mysql',
        port: process.env.DB_PORT
    }
)

async function connect() {
    try {
        await sequelize.sync({alter: true})
        console.log("A conexão foi estabelecida com sucesso.")
    } catch (error) {
        console.error("Não foi possível conectar ao banco de dados: ", error)
    }
}

export { sequelize, connect }