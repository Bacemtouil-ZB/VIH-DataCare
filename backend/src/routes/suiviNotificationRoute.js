// suiviNotificationRoute.js

import express from "express";
import {
  getNotifications,
  getDateEstimee,
} from "../controllers/suiviNotificationController.js";

const router = express.Router();

router.get("/", getNotifications);
router.get("/:numero", getDateEstimee);   

export default router;