import express from "express";
import {
  createSignesFonctionnelsController,
  getSignesByPatientController,
  getSignesByExamenController,
  updateSignesFonctionnelsController,
  getAppareilsController,
} from "../controllers/signeFonctinController.js";
import {
  protect,
  authorizeMedecin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/appareils",
  protect,
  getAppareilsController
);

router.get(
  "/patient/:numero",
 // protect,
  //authorizeMedecin,
  getSignesByPatientController
);

router.get(
  "/examen/:examenId",
  protect,
  authorizeMedecin,
  getSignesByExamenController
);

router.post(
  "/add",
  protect,
  authorizeMedecin,
  createSignesFonctionnelsController
);

router.put(
  "/update/:examenId",
  protect,
  authorizeMedecin,
  updateSignesFonctionnelsController
);

export default router;