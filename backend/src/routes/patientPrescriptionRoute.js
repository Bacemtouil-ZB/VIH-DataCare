import express from "express";
import { getPatientsWithPrescriptionsController } from "../controllers/patientPrescriptionController.js";
import { protect, authorizePharmacien } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/patients/prescriptions-medicales
router.get("/", protect, authorizePharmacien, getPatientsWithPrescriptionsController);

export default router;
