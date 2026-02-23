import express from "express";
import {
  createVihController,
  getVihController,
  getVihByNumeroDossier,
  updateVihController,
} from "../controllers/vihController.js";

import { protect, authorizeMedecin } from "../middlewares/authMiddleware.js";
import { validateCreateVih } from "../middlewares/vihMiddleware.js";
const router = express.Router();

router.get(
  "/patient/:numero",
  protect,
  authorizeMedecin,
  getVihByNumeroDossier,
);

router.post(
  "/add",
  protect,
  authorizeMedecin,
  validateCreateVih,
  createVihController,
);

router.put(
  "/update/:id",
  protect,
  authorizeMedecin,
  validateCreateVih,
  updateVihController,
);

router.get("/:id", protect, authorizeMedecin, getVihController);

export default router;
