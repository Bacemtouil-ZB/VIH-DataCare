import express from "express";
import {
  loginController,
  registerController,
} from "../controllers/authController.js";
import {
  validateLogin,
  validateRegister,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", validateLogin, loginController);
router.post("/register", validateRegister, registerController);

export default router;
