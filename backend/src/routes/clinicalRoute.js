import express from "express";
import {
  createExamenController,
  getExamenController,
  getExamensByPatientController,
  updateExamenController,

} from "../controllers/examenCliniqueController.js";
import { protect ,authorizeMedecin} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/patient/:patientId",
  protect,
  authorizeMedecin,
  getExamensByPatientController
);

router.post(
  "/add",
  protect,
  authorizeMedecin,
  createExamenController
);

router.put(
  "/update/:id",
  protect,
  authorizeMedecin,
  updateExamenController
);

router.get(
  "/:id",
  protect,
  authorizeMedecin,
  getExamenController
);

export default router;