import { Model, DataTypes } from "sequelize"
import { sequelize } from "../config/connection.js"

class Category extends Model {}

Category.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false
        },
        use_in_menu: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        }
    },
    {
        sequelize,
        tableName: "categories"
    }
)

export default Category