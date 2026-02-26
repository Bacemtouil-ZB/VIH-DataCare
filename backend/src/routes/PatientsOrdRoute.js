import express from "express";
import { getPatientsWithOrdonnancesController } from "../controllers/PatientsOrdController.js";
import { protect, authorizePharmacien} from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/patients/ordonnances
 * Récupère la liste des patients avec leurs ordonnances
 * Accessible par : pharmacien, medecin, analyste
 */
router.get(
  "/", 
  protect, 
  authorizePharmacien, 
  getPatientsWithOrdonnancesController
);

export default router;