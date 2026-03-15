import express from "express";
import {
  createConclusionController,
  listConclusionsByPatientController,
  updateConclusionController,
  getConclusionDetailsController,
} from "../controllers/doctorConclusionsController.js";

import { protect } from "../middlewares/authMiddleware.js";
//link validators for doctor conclusions not yet implemented
// import {
//   validateCreateConclusion,
//   validateUpdateConclusion,
// } from "../middlewares/validators/conclusionValidator.js";

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
  //validateCreateConclusion,
  createConclusionController,
);

// details
router.get("/medecin/conclusions/:id", protect, getConclusionDetailsController);

// update
router.put(
  "/medecin/conclusions/:id",
  protect,
  //validateUpdateConclusion,
  updateConclusionController,
);

export default router;
