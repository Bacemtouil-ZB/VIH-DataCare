import express from "express";
import {
  loginController,
  registerController,
  logoutController,
  getMe,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.post("/logout", logoutController);
// route protégée pour récupérer l'utilisateur connecté
router.get("/me", protect, getMe);
export default router;
