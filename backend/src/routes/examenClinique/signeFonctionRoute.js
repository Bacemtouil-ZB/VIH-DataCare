//cheked 15/04/2026
import express from "express";
import {
  createSignesFonctionnelsController,
  getSignesByPatientController,
  updateSignesFonctionnelsController,
  getAppareilsController,
} from "../../controllers/examenClinique/signeFonctinController.js";
import { protect, authorizeMedecin } from "../../middlewares/authMiddleware.js";
//link validators for signes fonctionnels not yet implemented
 import {
validateCreateSignesFonctionnels,validateUpdateSignesFonctionnels
} from "../../middlewares/validators/examenValidator.js";
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
  authorizeMedecin,validateCreateSignesFonctionnels,
  createSignesFonctionnelsController,
);

router.put(
  "/update/:examenId",
  protect,
  authorizeMedecin,validateUpdateSignesFonctionnels,
  updateSignesFonctionnelsController,
);

export default router;
