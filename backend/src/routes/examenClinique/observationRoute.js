//cheked 15/04/2026
import express from "express";
import {
  createObservationController,
  getObservationsByNumeroDossierController,
  updateObservationController,
} from "../../controllers/examenClinique/observationController.js";
import { protect, authorizeMedecin } from "../../middlewares/authMiddleware.js";
//link validators for observation not yet implemented
import { validateUpdateObservation,validateCreateObservation} from "../../middlewares/validators/examenValidator.js";

const router = express.Router();

router.post("/add", protect, authorizeMedecin,validateCreateObservation ,createObservationController);
router.get(
  "/patient/:numeroDossier",
  protect,
  authorizeMedecin,
  getObservationsByNumeroDossierController,
);
router.put(
  "/update/:id",
  protect,
  authorizeMedecin,validateUpdateObservation,
  updateObservationController,
);

export default router;
