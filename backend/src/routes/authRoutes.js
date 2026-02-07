import express from "express";
import {
  loginController,
  registerController,
  logoutController,
  getMe,
} from "../controllers/authController.js";
import {
  protect,
  validateLogin,
  validateRegister,
} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/login", validateLogin, loginController);
router.post("/register", validateRegister, registerController);
router.post("/logout", logoutController);
// route protégée pour récupérer l'utilisateur connecté
router.get("/me", protect, getMe);
export default router;
