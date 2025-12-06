import mongoose from "mongoose";

const specSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Xüsusiyyət adını daxil edin"],
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Spec = mongoose.model("Spec", specSchema);
export default Spec;

