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
} from "../middlewares/rateLimiters/patientRateLimiter.js";
const router = express.Router();

router.get(
  "/check/:numero",
  protect,
  checkNumeroExistsController,
  checkNumerolimiter,
);

router.get(
  "/getAllPatients",
  protect,
  authorizeMedecin,
  validateCreatePatient,
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

export default router;
