import { Model, DataTypes } from "sequelize"
import { sequelize } from "../config/connection.js"

class ImageProduct extends Model {}

ImageProduct.init(
    {
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: "images_product"
    }
)

export default ImageProduct