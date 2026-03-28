import express from "express";
import {
  getController,
  addController,
  validerController,
  updateQuantiteDelivreeController
  , getLastPerPatientController
} from "../controllers/prescriptionWorkflowController.js";
import { protect, authorizeMedecin, authorizePharmacien } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/numero-dossier/:numeroDossier", protect, getController);

router.post("/add", protect, authorizeMedecin, addController);

router.patch("/:id/valider", protect, authorizePharmacien, validerController);

router.patch("/:id/quantite-delivree", protect, authorizePharmacien, updateQuantiteDelivreeController);
router.get("/last-per-patient", protect, getLastPerPatientController);


export default router;