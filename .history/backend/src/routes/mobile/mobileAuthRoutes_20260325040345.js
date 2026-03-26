import express from "express";
import {
  mobileLoginController,
  mobileChangePasswordController,
  mobileGetMeController,
  mobileLogoutController,
} from "../../controllers/mobile/mobileAuthController.js";
import { mobileProtect } from "../../middlewares/mobileAuthMiddleware.js";

const router = express.Router();

router.post("/login", mobileLoginController);
router.put("/change-password", mobileProtect, mobileChangePasswordController);
router.get("/me", mobileProtect, mobileGetMeController);
router.post("/logout", mobileProtect, mobileLogoutController);

export default router;
