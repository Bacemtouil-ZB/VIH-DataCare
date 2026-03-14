import express from "express";
import {
  createExamenCliniqueController,
  getExamensByPatientController,
  updateExamenCliniqueController,
} from "../../controllers/examenClinique/examenCliniqueController.js";

import { protect, authorizeMedecin } from "../../middlewares/authMiddleware.js";

import {
  validateCreateExamen,
  validateUpdateExamen,
} from "../../middlewares/validators/examenCliniqueValidator.js";

const router = express.Router();

router.post(
  "/add",
  protect,
  authorizeMedecin,
  validateCreateExamen,
  createExamenCliniqueController,
);

router.get(
  "/patient/:numero",
  protect,
  authorizeMedecin,
  getExamensByPatientController,
);

router.put(
  "/update/:id",
  protect,
  authorizeMedecin,
  validateUpdateExamen,
  updateExamenCliniqueController,
);

export default router;
