import mongoose from "mongoose"
import products from "./data.js"
import Product from "../model/Product.js"

const seedProducts = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/backend-4")

        await Product.deleteMany()
        console.log("Mehsullar silindi")
        await Product.insertMany(products)
        console.log("Mehsullar elave olundu")
        process.exit()
    }

    catch (err) {
        process.exit()
    }
}

seedProducts()
