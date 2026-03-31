import express from "express";
import { getFamilyController, createFamilyController, updateFamilyController } from "../controllers/antecedents/familyController.js";
import { getGynecoController, createGynecoController, updateGynecoController } from "../controllers/antecedents/gynecoController.js";
import { getHabitudesVieController, createHabitudesVieController, updateHabitudesVieController } from "../controllers/antecedents/habitudesVieController.js";
import { getMedicalController, createMedicalController, updateMedicalController } from "../controllers/antecedents/medicalController.js";
import { getSurgicalController, createSurgicalController, updateSurgicalController, deleteSurgicalController } from "../controllers/antecedents/surgicalController.js";
import { getTherapeuticController, createTherapeuticController, updateTherapeuticController } from "../controllers/antecedents/therapeuticController.js";
import { getTpePrepController, createTpePrepController, updateTpePrepController, deleteTpePrepController } from "../controllers/antecedents/tpePrepController.js";
import { getTransfusionController, createTransfusionController, updateTransfusionController, deleteTransfusionController } from "../controllers/antecedents/transfusionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ─────────────────────────────────────────────
// Antécédent Familial
// ─────────────────────────────────────────────
router.get("/family/:patientId",    protect, getFamilyController);
router.post("/family/:patientId",   protect, createFamilyController);
router.put("/family/:patientId",    protect, updateFamilyController);

// ─────────────────────────────────────────────
// Antécédent Gynécologique
// ─────────────────────────────────────────────
router.get("/gyneco/:patientId",    protect, getGynecoController);
router.post("/gyneco/:patientId",   protect, createGynecoController);
router.put("/gyneco/:patientId",    protect, updateGynecoController);

// ─────────────────────────────────────────────
// Habitudes de Vie
// ─────────────────────────────────────────────
router.get("/habitudes-vie/:patientId",   protect, getHabitudesVieController);
router.post("/habitudes-vie/:patientId",  protect, createHabitudesVieController);
router.put("/habitudes-vie/:patientId",   protect, updateHabitudesVieController);

// ─────────────────────────────────────────────
// Antécédent Médical
// ─────────────────────────────────────────────
router.get("/medical/:patientId",   protect, getMedicalController);
router.post("/medical/:patientId",  protect, createMedicalController);
router.put("/medical/:patientId",   protect, updateMedicalController);

// ─────────────────────────────────────────────
// Antécédent Chirurgical
// ─────────────────────────────────────────────
router.get("/surgical/:patientId",  protect, getSurgicalController);
router.post("/surgical/:patientId", protect, createSurgicalController);
router.put("/surgical/:id",         protect, updateSurgicalController);
router.delete("/surgical/:id",      protect, deleteSurgicalController);

// ─────────────────────────────────────────────
// Antécédent Thérapeutique
// ─────────────────────────────────────────────
router.get("/therapeutic/:patientId",   protect, getTherapeuticController);
router.post("/therapeutic/:patientId",  protect, createTherapeuticController);
router.put("/therapeutic/:patientId",   protect, updateTherapeuticController);

// ─────────────────────────────────────────────
// Antécédent TPE/PrEP
// ─────────────────────────────────────────────
router.get("/tpe-prep/:patientId",  protect, getTpePrepController);
router.post("/tpe-prep/:patientId", protect, createTpePrepController);
router.put("/tpe-prep/:id",         protect, updateTpePrepController);
router.delete("/tpe-prep/:id",      protect , deleteTpePrepController);

// ─────────────────────────────────────────────
// Antécédent Transfusion
// ─────────────────────────────────────────────
router.get("/transfusion/:patientId",   protect, getTransfusionController);
router.post("/transfusion/:patientId",  protect, createTransfusionController);
router.put("/transfusion/:id",          protect, updateTransfusionController);
router.delete("/transfusion/:id",       protect, deleteTransfusionController);

export default router;