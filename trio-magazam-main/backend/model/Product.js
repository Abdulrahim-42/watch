// backend/model/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Məhsul adını daxil edin"],
      maxLength: [255, "Məhsul adı çox uzundur"],
    },

    brand: {
      type: String,
      required: [true, "Brend adı daxil edin"],
    },

    model: {
      type: String,
      required: [true, "Model adını daxil edin"],
    },

    price: {
      type: Number,
      required: [true, "Qiyməti daxil edin"],
    },

    description: {
      type: String,
      required: [true, "Açıqlama daxil edin"],
    },

    // 🔥 Dinamik kateqoriya — artıq enum yoxdur
    category: {
      type: String,
      required: [true, "Kateqoriya daxil edin"],
    },
    
    // Alt kateqoriya
    subcategory: {
      type: String,
      default: "",
    },

    // 🔥 Dinamik SPEC key:value
    // Frontend-dən istədiyin qədər özün əlavə edirsən
    specs: {
      type: Object,
      default: {},
    },

    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],

    stock: {
      type: Number,
      required: [true, "Stok miqdarını daxil edin"],
    },

    ratings: {
      type: Number,
      default: 0,
    },

    numOfReviews: {
      type: Number,
      default: 0,
    },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: { type: Number, required: true },
        comment: { type: String },
      },
    ],

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
export default Product;
