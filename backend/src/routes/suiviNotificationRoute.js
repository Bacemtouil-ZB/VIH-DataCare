import express from "express";
import {
  getNotificationsController,
  getDateEstimee,
} from "../controllers/suiviNotificationController.js";

const router = express.Router();

router.get("/", getNotificationsController);
router.get("/:numero", getDateEstimee);

export default router;