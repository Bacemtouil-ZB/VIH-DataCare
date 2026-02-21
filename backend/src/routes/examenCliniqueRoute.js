import express from "express";
import {
  createExamenCliniqueController,
  getExamenCliniqueController,
  getExamensByPatientController,
  updateExamenCliniqueController,

} from "../controllers/examenCliniqueControleller.js";

import {
  protect,
  authorizeMedecin
} from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post(
  "/add",
  protect,
  authorizeMedecin,
  createExamenCliniqueController
);

router.get(
  "/patient/:numero",
  protect,
  authorizeMedecin,
  getExamensByPatientController
);

router.get(
  "/:id",
  protect,
  authorizeMedecin,
  getExamenCliniqueController
);


router.put(
  "/update/:id",
  protect,
  authorizeMedecin,
  updateExamenCliniqueController
);


export default router;