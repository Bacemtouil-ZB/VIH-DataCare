//cheked 15/04/2026
import express from "express";
import {
  createPatientController,
  getPatientByNumeroController,
  checkNumeroExistsController,
  getAllPatientsController,
  updatePatientController,
  getLeftPanelController,
} from "../controllers/patientController.js";

import {
  protect,
  authorizeMedecin,
} from "../middlewares/authMiddleware.js";

import {
  validateCreatePatient,
  validateUpdatePatient,
} from "../middlewares/validators/patientValidator.js";

import {
  createPatientLimiter,
  updatePatientLimiter,
  checkNumerolimiter,
  getPatientsLimiter,
} from "../middlewares/rateLimiters/patientRateLimiter.js";

const router = express.Router();

router.get(
  "/check/:numero",
  protect,
  checkNumerolimiter,
  checkNumeroExistsController,
);

router.get(
  "/getAllPatients",
  protect,
  authorizeMedecin,
  getPatientsLimiter,
  getAllPatientsController,
);

router.post(
  "/add",
  protect,
  authorizeMedecin,
  validateCreatePatient,
  createPatientLimiter,
  createPatientController,
);
// medecin et pharmacien
router.get(
  "/numero/:numero",
  protect,
  checkNumerolimiter,
  getPatientByNumeroController,
);

router.put(
  "/update/:id",
  protect,
  authorizeMedecin,
  validateUpdatePatient,
  updatePatientLimiter,
  updatePatientController,
);

//-- left panel data
router.get("/:numero/left-panel", getLeftPanelController);

export default router;
