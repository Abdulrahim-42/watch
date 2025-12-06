import express from "express";
const router = express.Router();

import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  addSubcategory,
  deleteSubcategory,
} from "../controller/categoryController.js";
import { uploadImage } from "../middleware/multer.js";

// Public routes
router.get("/categories", getCategories);
router.get("/categories/:id", getCategory);

// Admin routes
router.post(
  "/admin/categories",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  uploadImage,
  createCategory
);

router.put(
  "/admin/categories/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  uploadImage,
  updateCategory
);

router.delete(
  "/admin/categories/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteCategory
);

router.post(
  "/admin/categories/:categoryId/subcategories",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  uploadImage,
  addSubcategory
);

router.delete(
  "/admin/categories/:categoryId/subcategories/:subcategoryId",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteSubcategory
);

export default router;

