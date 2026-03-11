import express from "express";
import { protect, authorizeMedecin } from "../middlewares/authMiddleware.js"; // adapt naming
import {
  createPatientConclusionController,
  updatePatientConclusionController,
  listPatientConclusionsController,
  getConclusionDetailsController,
} from "../controllers/doctorConclusionsController.js";

const router = express.Router();

/**
 * Doctor area:
 * - create conclusion for patient
 * - list history for patient
 * - edit own conclusion
 */
router.get(
  "/medecin/patients/:numero/conclusions",
  protect,
  authorizeMedecin,
  listPatientConclusionsController,
);

router.post(
  "/medecin/patients/:numero/conclusions",
  protect,
  authorizeMedecin,
  createPatientConclusionController,
);

router.get(
  "/medecin/conclusions/:id",
  protect,
  authorizeMedecin,
  getConclusionDetailsController,
);

router.put(
  "/medecin/conclusions/:id",
  protect,
  authorizeMedecin,
  updatePatientConclusionController,
);

export default router;
