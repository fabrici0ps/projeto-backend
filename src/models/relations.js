import User from "./userModel.js"
import Category from "./categoryModel.js"
import Product from "./productModel.js"
import ImageProduct from "./imageProductModel.js"
import OptionsProduct from "./optionsProductModel.js"
import ProductsCategories from "./productsCategoriesModel.js"

Product.hasMany(ImageProduct, { foreignKey: "product_id", as: "images", onDelete: "CASCADE" })
Product.hasMany(OptionsProduct, { foreignKey: "product_id", as: "options", onDelete: "CASCADE" })
Product.belongsToMany(Category, { 
    through: ProductsCategories,
    foreignKey: "productId",
    otherKey: "categoryId",
    as: "categories"
})

ImageProduct.belongsTo(Product, { foreignKey: "product_id" })

OptionsProduct.belongsTo(Product, { foreignKey: "product_id" })

Category.belongsToMany(Product, { 
    through: ProductsCategories,
    foreignKey: "categoryId",
    otherKey: "productId",
    as: "products"
})

export { 
    User, 
    Category, 
    Product,
    ImageProduct,
    OptionsProduct
}