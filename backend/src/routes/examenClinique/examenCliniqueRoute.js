import express from "express";
import {
  createExamenCliniqueController,
  getExamensByPatientController,
  updateExamenCliniqueController,

} from "../../controllers/examenClinique/examenCliniqueController.js";

import {
  protect,
  authorizeMedecin
} from "../../middlewares/authMiddleware.js";

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

router.put(
  "/update/:id",
  protect,
  authorizeMedecin,
  updateExamenCliniqueController
);


export default router;