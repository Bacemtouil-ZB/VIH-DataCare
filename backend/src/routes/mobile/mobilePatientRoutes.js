import express from "express";
import {
  getMobileAccountStatusController,
  createMobileAccountController,
  resetMobilePasswordController,
  deactivateMobileAccountController,
} from "../../controllers/mobile/mobilePatientController.js";
import { protect, authorizeMedecin } from "../../middlewares/authMiddleware.js";
// used for saving expo push token when patient logs in to send notifications later
import { savePushTokenController } from '../../controllers/mobile/mobileAuthController.js';
import { mobileProtect } from '../../middlewares/mobileAuthMiddleware.js';

const router = express.Router();

router.get("/account-status/:numero", protect, authorizeMedecin, getMobileAccountStatusController);
router.post("/create-account/:numero", protect, authorizeMedecin, createMobileAccountController);
router.put("/reset-password/:numero", protect, authorizeMedecin, resetMobilePasswordController);
router.put("/deactivate/:numero", protect, authorizeMedecin, deactivateMobileAccountController);
// used for saving expo push token when patient logs in to send notifications later
router.post('/push-token', mobileProtect, savePushTokenController);

export default router;