import express from "express";
import { protect,authorizeMedecin } from "../middlewares/authMiddleware.js";
import {
  createResultatController,
  getResultatsByNumeroDossierController,
  getDernierBilanPrescritController,
  updateResultatController,
} from "../controllers/resultatBiologiqueController.js";

const router = express.Router();

router.post("/add",            protect,authorizeMedecin,             createResultatController);
router.get( "/patient/:numeroDossier",     protect,authorizeMedecin,    getResultatsByNumeroDossierController);
router.get( "/dernier-bilan/:numeroDossier",  protect,authorizeMedecin,  getDernierBilanPrescritController);
router.put( "/update/:id",                    protect,authorizeMedecin,                    updateResultatController);

export default router;
