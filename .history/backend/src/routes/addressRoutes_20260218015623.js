import express from "express";
import { listAllAddresses } from "../controllers/addressController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, listAllAddresses);

export default router;
