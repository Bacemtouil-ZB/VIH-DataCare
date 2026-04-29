import express from "express";
import {
  getSuiviByPatientController,
  getSuiviByNumeroController,
  syncStatutsController,
} from "../controllers/suiviTherapeutiqueController.js";
import { protect, authorizePharmacien } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET  /suivi-therapeutique/patient/:patientId
router.get("/patient/:patientId", protect, getSuiviByPatientController);

// GET  /suivi-therapeutique/numero/:numeroDossier
router.get("/numero/:numeroDossier", protect, getSuiviByNumeroController);

// POST /suivi-therapeutique/sync  — synchronisation manuelle ou cron
router.post("/sync", protect, authorizePharmacien, syncStatutsController);

export default router;