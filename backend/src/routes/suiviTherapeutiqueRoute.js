import express from "express";
import {
  getSuiviByPatientController,
  getSuiviByNumeroController,

} from "../controllers/suiviTherapeutiqueController.js";
import {
  protect,

} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/patient/:patientId", protect, getSuiviByPatientController);
router.get("/numero/:numeroDossier", protect, getSuiviByNumeroController);

export default router;

