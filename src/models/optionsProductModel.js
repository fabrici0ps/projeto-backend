import { Model, DataTypes } from "sequelize"
import { sequelize } from "../config/connection.js"

class OptionsProduct extends Model {}

OptionsProduct.init(
    {
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        shape: {
            type: DataTypes.ENUM('square', 'circle'),
            defaultValue: 'square'
        },
        radius: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        type: {
            type: DataTypes.ENUM('text', 'color'),
            defaultValue: 'text'
        },
        values: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        sequelize,
        tableName: "options_product"
    }
)

export default OptionsProduct