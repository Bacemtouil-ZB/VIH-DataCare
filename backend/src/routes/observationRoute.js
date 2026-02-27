import express from "express";
import {
  createObservationController,
  getObservationsByNumeroDossierController,
  updateObservationController,
} from "../controllers/observationController.js";

const router = express.Router();

router.post("/add",                   createObservationController);
router.get("/patient/:numeroDossier", getObservationsByNumeroDossierController);
router.put("/update/:id",             updateObservationController);

export default router;