import express from "express";
import { protect, authorizeMedecin } from "../middlewares/authMiddleware.js";
import {
  createResultatController,
  getResultatsByNumeroDossierController,
  // getDernierBilanPrescritController,
  updateResultatController,
} from "../controllers/resultatBiologiqueController.js";
import {
  validateCreateResultatBiologique,
  validateUpdateResultatBiologique,
} from "../middlewares/validators/resultatBiologiqueValidator.js";

const router = express.Router();

router.post(
  "/add",
  protect,
  authorizeMedecin,
  validateCreateResultatBiologique,
  createResultatController,
);

router.get(
  "/patient/:numeroDossier",
  protect,
  authorizeMedecin,
  getResultatsByNumeroDossierController,
);

// router.get(
//   "/dernier-bilan/:numeroDossier",
//   protect,
//   authorizeMedecin,
//   getDernierBilanPrescritController,
// );

router.put(
  "/update/:id",
  protect,
  authorizeMedecin,
  validateUpdateResultatBiologique,
  updateResultatController,
);

export default router;
