import express from "express";
const router = express.Router();

import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";
import {
  getSpecs,
  getSpec,
  createSpec,
  updateSpec,
  deleteSpec,
} from "../controller/specController.js";

// Public routes
router.get("/specs", getSpecs);
router.get("/specs/:id", getSpec);

// Admin routes
router.post(
  "/admin/specs",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  createSpec
);

router.put(
  "/admin/specs/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateSpec
);

router.delete(
  "/admin/specs/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteSpec
);

export default router;

