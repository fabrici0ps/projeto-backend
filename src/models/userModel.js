import { Model, DataTypes } from "sequelize"
import { sequelize } from "../config/connection.js"

class User extends Model {}

User.init(
    {
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: "users"
    }
)

export default User