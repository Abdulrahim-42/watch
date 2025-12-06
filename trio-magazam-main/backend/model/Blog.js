import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Başlıq tələb olunur"],
    },
    shortContent: {
      type: String,
      required: [true, "Kiçik məzmun tələb olunur"],
    },
    content: {
      type: String,
      required: [true, "Böyük məzmun tələb olunur"],
    },
    date: {
      type: Date,
      required: [true, "Tarix tələb olunur"],
    },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", BlogSchema);
export default Blog;
