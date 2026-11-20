import User from "./userModel.js"
import Category from "./categoryModel.js"
import Product from "./productModel.js"
import ImageProduct from "./imageProductModel.js"
import OptionsProduct from "./optionsProductModel.js"
import ProductsCategories from "./productsCategoriesModel.js"

Product.hasMany(ImageProduct, { foreignKey: "productId" })
Product.hasMany(OptionsProduct, { foreignKey: "productId" })
Product.belongsToMany(Category, { 
    through: ProductsCategories,
    foreignKey: "productId",
    otherKey: "categoryId"
})

ImageProduct.belongsTo(Product, { foreignKey: "productId" })

OptionsProduct.belongsTo(Product, { foreignKey: "productId" })

Category.belongsToMany(Product, { 
    through: ProductsCategories,
    foreignKey: "categoryId",
    otherKey: "productId" 
})

export { 
    User, 
    Category, 
    Product,
    ImageProduct,
    OptionsProduct
}