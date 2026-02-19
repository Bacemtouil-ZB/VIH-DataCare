import express from "express";
import { listAllAddresses } from "../controllers/addresseController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/All", protect, listAllAddresses);

export default router;
