import express from "express";
import {
  createPrescriptionExamenController,
  getPrescriptionsByNumeroDossierController,
  updatePrescriptionExamenController,
} from "../controllers/prescriptionMedicalController.js";
import { protect, authorizeMedecin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add",                      protect, authorizeMedecin, createPrescriptionExamenController);
router.get( "/patient/:numeroDossier",   protect, authorizeMedecin, getPrescriptionsByNumeroDossierController);
router.put( "/update/:id",               protect, authorizeMedecin, updatePrescriptionExamenController);

export default router;