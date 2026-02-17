import express from "express";
import {
  createVihController,
  getVihController,
  getVihByPatientController,
  updateVihController,
  getVihHistoryController,
} from "../controllers/vihController.js";
import {
  validateCreateVih,
  validateUpdateVih,
} from "../middlewares/vihMiddleware.js";
import {
  protect,
  authorizeMedecin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/patient/:patientId",
  protect,
  authorizeMedecin,
  getVihByPatientController
);

router.post(
  "/add",
  protect,
  authorizeMedecin,
  validateCreateVih,
  createVihController
);

router.put(
  "/update/:id",
  protect,
  authorizeMedecin,
  validateUpdateVih,
  updateVihController
);


router.get(
  "/:id",
  protect,
  authorizeMedecin,
  getVihController
);
router.get(
  "/history/:patientId",
  protect,
  authorizeMedecin,
  getVihHistoryController
);


export default router;