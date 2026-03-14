import express from "express";
import {
  createVihController,
  getVihController,
  getVihByNumeroDossierController,
  updateVihController,
} from "../controllers/vihController.js";

import { protect, authorizeMedecin } from "../middlewares/authMiddleware.js";
import { validateCreateVih } from "../middlewares/vihMiddleware.js";

import {
  validateCreateVih,
  validateUpdateVih,
} from "../middlewares/validators/vihValidator.js";

const router = express.Router();

router.get(
  "/patient/:numero",
  protect,
  authorizeMedecin,
  getVihByNumeroDossierController,
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
  validateUpdateVih,
  updateVihController,
);

router.get("/:id", protect, authorizeMedecin, getVihController);

export default router;
