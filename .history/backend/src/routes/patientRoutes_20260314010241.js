import express from "express";
import {
  createPatientController,
  getPatientByNumeroController,
  checkNumeroExistsController,
  getAllPatientsController,
  updatePatientController,
} from "../controllers/patientController.js";

import {
  protect,
  authorizeMedecin,
  authorizePharmacien,
} from "../middlewares/authMiddleware.js";

import {
  validateCreatePatient,
  validateUpdatePatient,
} from "../middlewares/validators/patientValidator.js";

import {
  createPatientLimiter,
  updatePatientLimiter,
  checkNumerolimiter,
} from "../middlewares/rateLimiter.js";
const router = express.Router();

router.get("/check/:numero", checkNumeroExistsController, checkNumerolimiter);

router.get(
  "/getAllPatients",
  protect,
  authorizeMedecin,
  getAllPatientsController,
);

router.post("/add", protect, authorizeMedecin, createPatientController);
// medecin et pharmacien
router.get("/numero/:numero", protect, getPatientByNumeroController);

router.put("/update/:id", protect, authorizeMedecin, updatePatientController);

export default router;
