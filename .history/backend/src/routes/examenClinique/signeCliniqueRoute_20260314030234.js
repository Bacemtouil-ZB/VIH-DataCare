import express from "express";
import {
  createSigneCliniqueController,
  getSigneCliniqueByNumeroDossierController,
  updateSigneCliniqueController,
} from "../../controllers/examenClinique/signeCliniqueController.js";
import { protect, authorizeMedecin } from "../../middlewares/authMiddleware.js";
import {
  validateSignesCliniques,
  validateAutreSigneClinique,
} from "../../middlewares/validators/examenCliniqueValidator.js";

const router = express.Router();

router.post(
  "/add",
  protect,
  authorizeMedecin,
  validateSignesCliniques,
  validateAutreSigneClinique,
  createSigneCliniqueController,
);
router.get(
  "/patient/:numeroDossier",
  protect,
  authorizeMedecin,
  getSigneCliniqueByNumeroDossierController,
);
router.put(
  "/update/:id",
  protect,
  authorizeMedecin,
  validateSignesCliniques,
  validateAutreSigneClinique,
  updateSigneCliniqueController,
);

export default router;
