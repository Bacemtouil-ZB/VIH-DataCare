import express from "express";
import {
  createHabitudeDeVieController,
  getHabitudeDeVieByIdController,
  getHabitudeDeVieByNumeroDossierController,
  updateHabitudeDeVieController,
} from "../controllers/habitudeDeVieController.js";
import { protect, authorizeMedecin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, authorizeMedecin, createHabitudeDeVieController);

router.get("/:id", protect, authorizeMedecin, getHabitudeDeVieByIdController);

router.get("/patient/:numeroDossier", protect, authorizeMedecin, getHabitudeDeVieByNumeroDossierController);

router.put("/update/:id", protect, authorizeMedecin, updateHabitudeDeVieController);

export default router;