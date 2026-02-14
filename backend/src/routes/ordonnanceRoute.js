import express from "express";
import {
  addMedicalTreatmentController,
  findByNumeroDossierController,
  getThreeLastPriseController,
  getTreatmentStartDateController,
  getNextIntakeDateController,
  getOrdonnanceController,
  updateOrdonnanceController,
  getPatientsPerduDeVueController,
  updateDateProchainePriseController,
  getStatistiquesController,
} from "../controllers/ordonnanceController.js";
import {
  protect,
  authorizePharmacien,
  authorizeMedecin,
  authorizeAnalyste,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Statistiques
 */
router.get(
  "/stats",
  protect,authorizeAnalyste,
  getStatistiquesController
);

/**
 * Patients perdus de vue
 * GET /api/ordonnances/perdus-de-vue
 */
router.get(
  "/perdus-de-vue",
  protect,
  getPatientsPerduDeVueController
);

/**
 * Ajouter un traitement (Médecin)
 */
router.post(
  "/add",
  protect,
  authorizeMedecin,
  addMedicalTreatmentController
);

/**
 * Trouver par numéro de dossier
 */
router.get(
  "/numero-dossier/:numeroDossier",
  protect,
  findByNumeroDossierController
);

/**
 * 3 dernières prises d'un patient
 */
router.get(
  "/patient/:numeroDossier/last-three",
  protect,
  getThreeLastPriseController
);

/**
 * Date de début du traitement
 */
router.get(
  "/:id/start-date",
  protect,
  getTreatmentStartDateController
);

/**
 * Date de prochaine prise
 */
router.get(
  "/:id/next-date",
  protect,
  getNextIntakeDateController
);

/**
 * Mettre à jour (Médecin)
 */
router.put(
  "/:id",
  protect,
  authorizeMedecin,
  updateOrdonnanceController
);

/**
 * Mettre à jour date prochaine prise (Pharmacien)
 * PATCH /api/ordonnances/:id/date-prochaine-prise
 */
router.patch(
  "/:id/date-prochaine-prise",
  protect,
  authorizePharmacien,
  updateDateProchainePriseController
);

/**
 * Récupérer une ordonnance par ID
 */
router.get(
  "/:id",
  protect,
  getOrdonnanceController
);

export default router;