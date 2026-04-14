import express from "express";
import {
  createSigneCliniqueController,
  getSigneCliniqueByNumeroDossierController,
  updateSigneCliniqueController,
} from "../../controllers/examenClinique/signeCliniqueController.js";
import { protect, authorizeMedecin } from "../../middlewares/authMiddleware.js";
import { validateUpdateSignesCliniques,validateCreateSignesCliniques} from "../../middlewares/validators/examenValidator.js";

const router = express.Router();

router.post("/add", protect, authorizeMedecin, validateCreateSignesCliniques,createSigneCliniqueController);
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
  validateUpdateSignesCliniques,
  updateSigneCliniqueController,
);

export default router;
