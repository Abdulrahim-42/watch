import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Kateqoriya adını daxil edin"],
      unique: true,
      trim: true,
    },
    image: {
      public_id: { type: String },
      url: { type: String },
    },
    subcategories: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
export default Category;

