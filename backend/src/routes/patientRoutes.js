import express from "express";
import {
  createPatientController,
  //getPatientController,
  getPatientByNumeroController,
  checkNumeroExistsController,
  getAllPatientsController,
  updatePatientController,
  //searchPatientController,
  //updateLastVisitController,
} from "../controllers/patientController.js";
import { validateCreatePatient } from "../middlewares/patientMiddleware.js";
import { protect, authorizeMedecin,authorizePharmacien } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/check/:numero", checkNumeroExistsController);

// router.get("/search", protect, authorizeMedecin, searchPatientController);

router.get(
  "/getAllPatients",
  protect,
  authorizeMedecin,
  getAllPatientsController,
);

router.post(
  "/add",
  protect,
  authorizeMedecin,
  // validateCreatePatient,
  createPatientController,
);

router.get(
  "/numero/:numero",
  protect,
  authorizeMedecin,
  getPatientByNumeroController,
);

// router.get("/:id", protect, authorizeMedecin, getPatientController);

router.put("/update/:id", protect, authorizeMedecin, updatePatientController);

// router.patch(
//   "/:id/lastVisit",
//   protect,
//   authorizeMedecin,
//   updateLastVisitController,
// );

export default router;



