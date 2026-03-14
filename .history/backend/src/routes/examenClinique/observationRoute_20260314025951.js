import express from "express";
import {
  createObservationController,
  getObservationsByNumeroDossierController,
  updateObservationController,
} from "../../controllers/examenClinique/observationController.js";
import { protect, authorizeMedecin } from "../../middlewares/authMiddleware.js";
import { validateObservation } from "../../middlewares/validators/examenCliniqueValidator.js";

const router = express.Router();

router.post(
  "/add",
  protect,
  authorizeMedecin,
  validateObservation,
  createObservationController,
);
router.get(
  "/patient/:numeroDossier",
  protect,
  authorizeMedecin,
  getObservationsByNumeroDossierController,
);
router.put(
  "/update/:id",
  protect,
  authorizeMedecin,
  validateObservation,
  updateObservationController,
);

export default router;
