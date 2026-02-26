import express from "express";
import {
  getSocialByNumero,
  createSocial,
  updateSocial,
} from "../controllers/socialController.js";
import { protect, authorizeMedecin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Récupérer la fiche sociale par numéro de patient
router.get("/:numero", protect, authorizeMedecin, getSocialByNumero);

// Créer une fiche sociale
router.post("/:numero", protect, authorizeMedecin, createSocial);

// Mettre à jour une fiche sociale
router.put("/:numero", protect, authorizeMedecin, updateSocial);

export default router;
