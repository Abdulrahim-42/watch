import express from "express";
import {
    registerUser,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,   // ✅ Profil yeniləmə (ad/email)
} from "../controller/authController.js";

import { isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

// ========== AUTH ROUTES ==========
router.post("/register", registerUser);
router.post("/login", login);
router.get("/logout", logout);

// ========== PASSWORD (ŞİFRƏ) ROUTES ==========
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

// ========== PROFILE ROUTES ==========
// Ad / email yeniləmə (yalnız login olmuş user)
router.put("/me/update", isAuthenticatedUser, updateProfile);

// Gələcəkdə əlavə edə biləcəyin şeylər:
// - Səbətə əlavə et
// - Payment sistemi
// - Blocking mechanism
// - Admin idarəetmə

export default router;
