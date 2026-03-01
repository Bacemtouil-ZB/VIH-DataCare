import express from "express";
import {
  loginController,
  registerController,
  logoutController,
  getMe,
<<<<<<< HEAD
=======
  forgotPasswordController,
  resetPasswordController,
>>>>>>> feature/resetPassword
} from "../controllers/authController.js";
import {
  protect,
  validateLogin,
  validateRegister,
} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/login", validateLogin, loginController);
router.post("/register", validateRegister, registerController);
<<<<<<< HEAD
=======
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
>>>>>>> feature/resetPassword
router.post("/logout", logoutController);
// route protégée pour récupérer l'utilisateur connecté
router.get("/me", protect, getMe);
export default router;
