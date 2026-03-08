import express from "express";
import {
  createRendezvousController,
  getRendezvousByNumeroDossierController,
  getRendezvousByIdController,
  updateRendezvousController,
} from "../controllers/rendezVousController.js";
import { protect, authorizeMedecin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(  "/add",                    protect, authorizeMedecin, createRendezvousController);
router.get(   "/patient/:numeroDossier", protect, authorizeMedecin, getRendezvousByNumeroDossierController);
router.get(   "/:id",                    protect, authorizeMedecin, getRendezvousByIdController);
router.put(   "/update/:id",             protect, authorizeMedecin, updateRendezvousController);

export default router;