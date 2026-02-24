import express from "express";
import {
  createHabitudeDeVieController,
  getHabitudeDeVieController,
  getHabitudeDeVieByNumeroDossierController,
  updateHabitudeDeVieController,
} from "../controllers/habitudeDeVieController.js";
import {
  protect,
  authorizeMedecin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get(
  "/patient/:numeroDossier",
  protect,
  authorizeMedecin,
  getHabitudeDeVieByNumeroDossierController
);

router.post(
  "/add",
  protect,
  authorizeMedecin,
  createHabitudeDeVieController
);

router.put(
  "/update/:id",
  protect,
  authorizeMedecin,
  updateHabitudeDeVieController
);

router.get(
  "/:id",
  protect,
  authorizeMedecin,
  getHabitudeDeVieController
);

export default router;