import express from "express";
import {
  createConclusionController,
  listConclusionsByPatientController,
  updateConclusionController,
  getConclusionDetailsController,
} from "../controllers/doctorConclusionsController.js";

import { protect } from "../middlewares/authMiddleware.js"; // adapte si ton nom diffère

const router = express.Router();

// list history
router.get(
  "/medecin/patients/:patientId/conclusions",
  protect,
  listConclusionsByPatientController,
);

// create
router.post(
  "/medecin/patients/:patientId/conclusions",
  protect,
  createConclusionController,
);

// details (optional)
router.get("/medecin/conclusions/:id", protect, getConclusionDetailsController);

// update (only author doctor can update)
router.put("/medecin/conclusions/:id", protect, updateConclusionController);

export default router;
