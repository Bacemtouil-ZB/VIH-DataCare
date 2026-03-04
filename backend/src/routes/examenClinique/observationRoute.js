import express from "express";
import {
  createObservationController,
  getObservationsByNumeroDossierController,
  updateObservationController,
} from "../../controllers/examenClinique/observationController.js";
import { protect, authorizeMedecin } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add",      protect,    authorizeMedecin,         createObservationController);
router.get("/patient/:numeroDossier",      protect,    authorizeMedecin,         getObservationsByNumeroDossierController);
router.put("/update/:id",      protect,    authorizeMedecin,         updateObservationController);

export default router;