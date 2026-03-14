import express from "express";
import {
  createPatientController,
  getPatientByNumeroController,
  checkNumeroExistsController,
  getAllPatientsController,
  updatePatientController,
} from "../controllers/patientController.js";

import {
  protect,
  authorizeMedecin,
  authorizePharmacien,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/check/:numero", checkNumeroExistsController);

router.get(
  "/getAllPatients",
  protect,
  authorizeMedecin,
  getAllPatientsController,
);

router.post("/add", protect, authorizeMedecin, createPatientController);
// medecin et pharmacien
router.get("/numero/:numero", protect, getPatientByNumeroController);

router.put("/update/:id", protect, authorizeMedecin, updatePatientController);

export default router;
