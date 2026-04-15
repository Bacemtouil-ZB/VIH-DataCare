import express from "express";
import {
  createConclusionController,
  listConclusionsByPatientController,
  updateConclusionController,
  getConclusionDetailsController,
} from "../controllers/doctorConclusionsController.js";

import { protect,authorizeMedecin } from "../middlewares/authMiddleware.js";
import { validateCreateConclusion, validateUpdateConclusion } from "../middlewares/validators/conclusionValidator.js";


const router = express.Router();

// list history
router.get(
  "/medecin/patients/:numero/conclusions",
  protect,authorizeMedecin,
  listConclusionsByPatientController,
);

// create
router.post(
  "/medecin/patients/:numero/conclusions",
  protect,authorizeMedecin,
  validateCreateConclusion,
  createConclusionController,
);

// details
router.get("/medecin/conclusions/:id", protect,authorizeMedecin, getConclusionDetailsController);

// update
router.put(
  "/medecin/conclusions/:id",
  protect,
  authorizeMedecin,
  validateUpdateConclusion,
  updateConclusionController,
);

export default router;
