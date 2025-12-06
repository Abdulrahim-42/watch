import express from "express";
const router = express.Router();

import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";
import {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controller/brandController.js";

// Public routes
router.get("/brands", getBrands);
router.get("/brands/:id", getBrand);

// Admin routes
router.post(
  "/admin/brands",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  createBrand
);

router.put(
  "/admin/brands/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateBrand
);

router.delete(
  "/admin/brands/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteBrand
);

export default router;

