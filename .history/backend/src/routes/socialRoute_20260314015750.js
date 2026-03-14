import express from "express";
import {
  getSocialByNumero,
  createSocial,
  updateSocial,
} from "../controllers/socialController.js";
import { protect, authorizeMedecin } from "../middlewares/authMiddleware.js";
import {
  validateCreateSocial,
  validateUpdateSocial,
} from "../middlewares/validators/socialValidator.js";

const router = express.Router();

// Récupérer la fiche sociale par numéro de patient
router.get("/:numero", protect, authorizeMedecin, getSocialByNumero);

// Créer une fiche sociale
router.post(
  "/:numero",
  protect,
  authorizeMedecin,
  validateCreateSocial,
  createSocial,
);

// Mettre à jour une fiche sociale
router.put(
  "/:numero",
  protect,
  authorizeMedecin,
  validateUpdateSocial,
  updateSocial,
);

export default router;
