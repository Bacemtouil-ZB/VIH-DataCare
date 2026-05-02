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
import {
  validateLogin,
  validateRegister,
  validateForgotPassword,
  validateResetPassword,
} from "../middlewares/validators/authValidator.js";
import {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
} from "../middlewares/rateLimiters/authRateLimiter.js";

const router = express.Router();

router.post("/login", loginLimiter, validateLogin, loginController);
router.post("/register", registerLimiter, validateRegister, registerController);
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validateForgotPassword,
  forgotPasswordController,
);
router.post("/reset-password", resetPasswordLimiter, validateResetPassword, resetPasswordController);
router.post("/logout", logoutController);
router.get("/me", protect, getMe);

export default router;
