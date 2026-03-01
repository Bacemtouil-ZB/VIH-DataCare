import express from "express";
import {
  loginController,
  registerController,
  logoutController,
  getMe,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/authController.js";
import {
  protect,
  validateLogin,
  validateRegister,
} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/login", validateLogin, loginController);
router.post("/register", validateRegister, registerController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.post("/logout", logoutController);
// route protégée pour récupérer l'utilisateur connecté
router.get("/me", protect, getMe);
export default router;
