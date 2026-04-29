import express from "express";
import {
  getMobileRendezvousController,
  getMobileRendezvousDetailController,
} from "../../controllers/mobile/mobileRendezvousController.js";
import { mobileProtect } from "../../middlewares/mobileAuthMiddleware.js";

const router = express.Router();

router.get("/", mobileProtect, getMobileRendezvousController);
router.get("/:id", mobileProtect, getMobileRendezvousDetailController);

export default router;