import express from "express";
import {
  createSignesFonctionnelsController,
  getSignesByPatientController,
  updateSignesFonctionnelsController,
  getAppareilsController,
} from "../../controllers/examenClinique/signeFonctinController.js";
import { protect, authorizeMedecin } from "../../middlewares/authMiddleware.js";

import {
  validateSignesFonctionnels,
  validateAutreSigneFonctionnel,
} from "../../middlewares/validators/examenCliniqueValidator.js";
const router = express.Router();

router.get("/appareils", protect, getAppareilsController);

router.get(
  "/patient/:numero",
  protect,
  authorizeMedecin,
  getSignesByPatientController,
);

router.post(
  "/add",
  protect,
  authorizeMedecin,
  validateSignesFonctionnels,
  validateAutreSigneFonctionnel,
  createSignesFonctionnelsController,
);

router.put(
  "/update/:examenId",
  protect,
  authorizeMedecin,
  validateSignesFonctionnels,
  validateAutreSigneFonctionnel,
  updateSignesFonctionnelsController,
);

export default router;
