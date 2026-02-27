import express from "express";
import {
  createSigneCliniqueController,
  getSigneCliniqueByNumeroDossierController,
  updateSigneCliniqueController,
} from "../controllers/signeCliniqueController.js";
import { protect, authorizeMedecin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(  "/add",                    protect, authorizeMedecin, createSigneCliniqueController);
router.get(   "/patient/:numeroDossier", protect, authorizeMedecin, getSigneCliniqueByNumeroDossierController);
router.put(   "/update/:id",             protect, authorizeMedecin, updateSigneCliniqueController);

export default router;