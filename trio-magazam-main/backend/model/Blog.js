import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {              // Yeni açıklama alanı
      type: String,
      required: false,          // İsteğe bağlı; gerekiyorsa true de yapabilirsiniz
    },
    content: {
      type: String,
      required: true,
    },
    image: [
      {
        public_id: { type: String, required: false },
        url: { type: String, required: false },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // createdAt ve updatedAt otomatik oluşturulur
  }
);

const Blog = mongoose.model("Blog", BlogSchema);
export default Blog;