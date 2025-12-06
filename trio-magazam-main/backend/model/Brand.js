import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brend adını daxil edin"],
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Brand = mongoose.model("Brand", brandSchema);
export default Brand;

