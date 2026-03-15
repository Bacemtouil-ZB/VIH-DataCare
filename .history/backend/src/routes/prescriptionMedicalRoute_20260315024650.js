import express from "express";
import {
  createPrescriptionExamenController,
  getPrescriptionsByNumeroDossierController,
  updatePrescriptionExamenController,
} from "../controllers/prescriptionMedicalController.js";
import { protect, authorizeMedecin } from "../middlewares/authMiddleware.js";
//link validators for prescription medical not yet implemented
// import {
//   validateCreatePrescription,
//   validateUpdatePrescription,
// } from "../middlewares/validators/prescriptionValidator.js";

const router = express.Router();

router.post(
  "/add",
  protect,
  authorizeMedecin,
  //validateCreatePrescription,
  createPrescriptionExamenController,
);
router.get(
  "/patient/:numeroDossier",
  protect,
  authorizeMedecin,
  getPrescriptionsByNumeroDossierController,
);
router.put(
  "/update/:id",
  protect,
  authorizeMedecin,
  //validateUpdatePrescription,
  updatePrescriptionExamenController,
);

export default router;
