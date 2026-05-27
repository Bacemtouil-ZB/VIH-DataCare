//cheked 15/04/2026
import express from "express";
import { getFamilyController, createFamilyController, updateFamilyController } from "../controllers/antecedents/familyController.js";
import { getGynecoController, createGynecoController, updateGynecoController } from "../controllers/antecedents/gynecoController.js";
import { getHabitudesVieController, createHabitudesVieController, updateHabitudesVieController } from "../controllers/antecedents/habitudesVieController.js";
import { getMedicalController, createMedicalController, updateMedicalController } from "../controllers/antecedents/medicalController.js";
import { getSurgicalController, createSurgicalController, updateSurgicalController, deleteSurgicalController } from "../controllers/antecedents/surgicalController.js";
import { getTherapeuticController, createTherapeuticController, updateTherapeuticController } from "../controllers/antecedents/therapeuticController.js";
import { getTpePrepController, createTpePrepController, updateTpePrepController, deleteTpePrepController } from "../controllers/antecedents/tpePrepController.js";
import { getTransfusionController, createTransfusionController, updateTransfusionController, deleteTransfusionController } from "../controllers/antecedents/transfusionController.js";
import { protect , authorizeMedecin} from "../middlewares/authMiddleware.js";
import {validateCreateTpePrep,validateCreateTransfusion,validateFamily,validateGyneco,validateHabitudesVie,validateMedical,validateTherapeutic,validateUpdateSurgical,
    validateUpdateTpePrep,validateUpdateTransfusion,validateCreateSurgical,} from "../middlewares/validators/antecedentsvalidator.js";

import { requireFemme } from "../middlewares/checkPatientGender.js";

   const router = express.Router();
    
// ─────────────────────────────────────────────
// Antécédent Familial
// ─────────────────────────────────────────────
router.get("/family/:patientId",    protect,authorizeMedecin, getFamilyController);
router.post("/family/:patientId",   protect,authorizeMedecin, validateFamily, createFamilyController);
router.put("/family/:patientId",    protect,authorizeMedecin, validateFamily, updateFamilyController);

// ─────────────────────────────────────────────
// Antécédent Gynécologique
// ─────────────────────────────────────────────
router.get("/gyneco/:patientId",  protect, authorizeMedecin, requireFemme, getGynecoController);
router.post("/gyneco/:patientId", protect, authorizeMedecin, requireFemme, validateGyneco, createGynecoController);
router.put("/gyneco/:patientId",  protect, authorizeMedecin, requireFemme, validateGyneco, updateGynecoController);

// ─────────────────────────────────────────────
// Habitudes de Vie
// ─────────────────────────────────────────────
router.get("/habitudes-vie/:patientId",   protect,authorizeMedecin, getHabitudesVieController);
router.post("/habitudes-vie/:patientId",  protect,authorizeMedecin, validateHabitudesVie, createHabitudesVieController);
router.put("/habitudes-vie/:patientId",   protect,authorizeMedecin, validateHabitudesVie, updateHabitudesVieController);

// ─────────────────────────────────────────────
// Antécédent Médical
// ─────────────────────────────────────────────
router.get("/medical/:patientId",   protect,authorizeMedecin, getMedicalController);
router.post("/medical/:patientId",  protect,authorizeMedecin, validateMedical, createMedicalController);
router.put("/medical/:patientId",   protect,authorizeMedecin, validateMedical, updateMedicalController);

// ─────────────────────────────────────────────
// Antécédent Chirurgical
// ─────────────────────────────────────────────
router.get("/surgical/:patientId",  protect,authorizeMedecin, getSurgicalController);
router.post("/surgical/:patientId", protect,authorizeMedecin, validateCreateSurgical, createSurgicalController);
router.put("/surgical/:id",         protect,authorizeMedecin, validateUpdateSurgical, updateSurgicalController);
router.delete("/surgical/:id",      protect,authorizeMedecin, deleteSurgicalController);

// ─────────────────────────────────────────────
// Antécédent Thérapeutique
// ─────────────────────────────────────────────
router.get("/therapeutic/:patientId",   protect,authorizeMedecin, getTherapeuticController);
router.post("/therapeutic/:patientId",  protect,authorizeMedecin, validateTherapeutic, createTherapeuticController);
router.put("/therapeutic/:patientId",   protect,authorizeMedecin, validateTherapeutic, updateTherapeuticController);

// ─────────────────────────────────────────────
// Antécédent TPE/PrEP
// ─────────────────────────────────────────────
router.get("/tpe-prep/:patientId",  protect,authorizeMedecin, getTpePrepController);
router.post("/tpe-prep/:patientId", protect,authorizeMedecin, validateCreateTpePrep, createTpePrepController);
router.put("/tpe-prep/:id",         protect,authorizeMedecin, validateUpdateTpePrep, updateTpePrepController);
router.delete("/tpe-prep/:id",      protect,authorizeMedecin , deleteTpePrepController);

// ─────────────────────────────────────────────
// Antécédent Transfusion
// ─────────────────────────────────────────────
router.get("/transfusion/:patientId",   protect,authorizeMedecin, getTransfusionController);
router.post("/transfusion/:patientId",  protect,authorizeMedecin, validateCreateTransfusion, createTransfusionController);
router.put("/transfusion/:id",          protect,authorizeMedecin, validateUpdateTransfusion, updateTransfusionController);
router.delete("/transfusion/:id",       protect,authorizeMedecin, deleteTransfusionController);

export default router;