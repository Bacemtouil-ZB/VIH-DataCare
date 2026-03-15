import express from "express";
import {
  createSignesFonctionnelsController,
  getSignesByPatientController,
  updateSignesFonctionnelsController,
  getAppareilsController,
} from "../../controllers/examenClinique/signeFonctinController.js";
import { protect, authorizeMedecin } from "../../middlewares/authMiddleware.js";
//link validators for signes fonctionnels not yet implemented
// import {
//   validateSignesFonctionnels,
//   validateAutreSigneFonctionnel,
// } from "../../middlewares/validators/examenCliniqueValidator.js";
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
  createSignesFonctionnelsController,
);

router.put(
  "/update/:examenId",
  protect,
  authorizeMedecin,
  updateSignesFonctionnelsController,
);

export default router;
