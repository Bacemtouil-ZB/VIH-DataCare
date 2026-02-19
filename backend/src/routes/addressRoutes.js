import express from "express";
import {
  listAllAddresses,
  getFormData,
} from "../controllers/addresseController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/All", protect, listAllAddresses);
router.get("/form-data", getFormData);
export default router;
