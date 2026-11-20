import { Model, DataTypes } from "sequelize"
import { sequelize } from "../config/connection.js"

class ProductsCategories extends Model {}

ProductsCategories.init(
    {
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "product_id"
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "category_id"
        },
    },
    {
        sequelize,
        tableName: "products_categories",
        timestamps: false
    }
)

export default ProductsCategories