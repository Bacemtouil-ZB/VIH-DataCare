import express from "express";
import {
  createRendezvousController,
  getRendezvousByNumeroDossierController,
  getRendezvousByIdController,
  updateRendezvousController,
  getNextRendezVousPerPatientController,
} from "../controllers/rendezVousController.js";
import { protect, authorizeMedecin  } from "../middlewares/authMiddleware.js";
//link validators for rendez vous not yet implemented
 import {  validateCreateRendezVous,
  validateUpdateRendezVous,
} from "../middlewares/validators/rendezVousValidator.js";

const router = express.Router();

router.get( //get next rendezvous per patient this routes used by pharmacist and medecin
  "/next-all",
  protect,

  getNextRendezVousPerPatientController,
);

router.post(
  "/add",
  protect,
  authorizeMedecin,
  validateCreateRendezVous,
  createRendezvousController,
);
router.get(
  "/patient/:numeroDossier",
  protect,
  authorizeMedecin,
  getRendezvousByNumeroDossierController,
);
router.get("/:id", protect, authorizeMedecin, getRendezvousByIdController);
router.put(
  "/update/:id",
  protect,
  authorizeMedecin,
  validateUpdateRendezVous,
  updateRendezvousController,
);

export default router;
