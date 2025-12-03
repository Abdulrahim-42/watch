import express from "express";
import {
    getBlogs,
    getBlogDetails,
    newBlog,
    updateBlog,
    deleteBlog,
} from "../controller/blogController.js";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";
import { uploadImages } from "../middleware/multer.js"; // *Mövcud multer konfiqurasiyasına uyğun*

const router = express.Router();

// *İstifadəçilər üçün açıq rotalar*
router.get("/blogs", getBlogs);
router.get("/blogs/:id", getBlogDetails);

// *Admin üçün xüsusi rotalar (şəkil yükləmə də var)*
router.post("/admin/blogs", isAuthenticatedUser, authorizeRoles("admin"), uploadImages, newBlog);
router.put("/admin/blogs/:id", isAuthenticatedUser, authorizeRoles("admin"), uploadImages, updateBlog);
router.delete("/admin/blogs/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteBlog);

export default router;