import express from "express";
import {
  createConclusionController,
  listConclusionsByPatientController,
  updateConclusionController,
  getConclusionDetailsController,
} from "../controllers/doctorConclusionsController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// list history
router.get(
  "/medecin/patients/:numero/conclusions",
  protect,
  listConclusionsByPatientController,
);

// create
router.post(
  "/medecin/patients/:numero/conclusions",
  protect,
  createConclusionController,
);

// details
router.get("/medecin/conclusions/:id", protect, getConclusionDetailsController);

// update
router.put("/medecin/conclusions/:id", protect, updateConclusionController);

export default router;
