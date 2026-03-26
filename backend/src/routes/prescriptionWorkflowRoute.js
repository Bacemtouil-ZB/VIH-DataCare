import express from "express";
import {
  addMedicalTreatmentController,
  findByNumeroDossierController,
  getThreeLastPriseController,
  getTreatmentStartDateController,
  getNextIntakeDateController,
  getPrescriptionController,
  updatePrescriptionController,
  getPatientsPerduDeVueController,
  updateDateProchainePriseController,
  getStatistiquesController,
  validerPrescriptionController,
} from "../controllers/prescriptionWorkflowController.js";
import {
  protect,
  authorizePharmacien,
  authorizeMedecin,
  authorizeAnalyste,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, authorizeAnalyste, getStatistiquesController);
router.get("/perdus-de-vue", protect, getPatientsPerduDeVueController);

router.post("/add", protect, authorizeMedecin, addMedicalTreatmentController);

router.get("/numero-dossier/:numeroDossier", protect, findByNumeroDossierController);
router.get("/patient/:numeroDossier/last-three", protect, getThreeLastPriseController);

router.get("/:id/start-date", protect, getTreatmentStartDateController);
router.get("/:id/next-date", protect, getNextIntakeDateController);

router.put("/:id", protect, authorizeMedecin, updatePrescriptionController);
router.patch("/:id/date-prochaine-prise", protect, authorizePharmacien, updateDateProchainePriseController);
router.patch("/:id/valider", protect, authorizePharmacien, validerPrescriptionController);

router.get("/:id", protect, getPrescriptionController);

export default router;
