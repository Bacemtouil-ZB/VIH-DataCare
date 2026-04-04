// =====================================================
// ROUTES - prescriptionWorkflowRoute.js
// =====================================================

import express from "express";
import {
  getController,
  addController,
  validerController,
  validerAvecModificationController,
  supprimerExpireesController,
  getLastPerPatientController,
} from "../controllers/prescriptionWorkflowController.js";
import {
  protect,
  authorizeMedecin,
  authorizePharmacien,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET — Liste prescriptions par numéro dossier
router.get("/numero-dossier/:numeroDossier", protect, getController);

// POST — Créer prescription (médecin)
router.post("/add", protect, authorizeMedecin, addController);

// PATCH — Valider prescription SANS modification (pharmacien)
router.patch("/:id/valider", protect, authorizePharmacien, validerController);

// PATCH — Valider prescription AVEC modification période (pharmacien)
router.patch("/:id/valider-modifiee", protect, authorizePharmacien, validerAvecModificationController);

// GET — Dernière prescription par patient
router.get("/last-per-patient", protect, getLastPerPatientController);

// POST — Supprimer prescriptions expirées (cron ou manuel)
router.post("/supprimer-expirees", protect, authorizePharmacien, supprimerExpireesController);

export default router;