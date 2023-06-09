import express from "express";
import {
    registerUser,
    loginUser,
    logout,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword,
} from "../controllers/authController.js";

import { protect } from "./../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);

router.get("/logout", logout);
router.get("/current-user", protect, getCurrentUser);

router.put("/reset-password/:resetToken", resetPassword);
router.put("/update-details", protect, updateDetails);
router.put("/update-password", protect, updatePassword);

export default router;
