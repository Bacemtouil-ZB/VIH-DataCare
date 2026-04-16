//cheked 15/04/2026
import express from "express";
import { protect ,authorizeMedecin} from "../middlewares/authMiddleware.js";
import {
  createBilanExamenController,
  getBilansByNumeroDossierController,
  updateBilanExamenController,
} from "../controllers/bilanExamenController.js";

const router = express.Router();


router.post(  "/add",      protect ,authorizeMedecin  ,        createBilanExamenController);
router.get(   "/patient/:numeroDossier",  protect ,authorizeMedecin, getBilansByNumeroDossierController);
router.put(   "/update/:id",    protect ,authorizeMedecin,     updateBilanExamenController);

export default router;