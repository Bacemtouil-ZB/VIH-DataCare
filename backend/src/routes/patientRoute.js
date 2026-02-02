import express from "express";
import {
  createPatientController,
  getPatientController,
  getAllPatientsController,
  updatePatientController,
  searchPatientController,
  
} from "../controllers/patientController.js";
import {
  validateCreatePatient,
  validateUpdatePatient,
} from "../middlewares/patientMiddleware.js";
import {
  protect,
  authorizeAdmin,
  authorizeMedecin,
  authorizeAnalyste
} from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/search", protect, searchPatientController);

router.get("/getAllPatients", protect, getAllPatientsController);

router.get("/getPatientController/:id", protect, getPatientController);

router.put("/update/:id",protect,validateUpdatePatient,updatePatientController);

router.post("/add",protect,validateCreatePatient,createPatientController);


export default router;