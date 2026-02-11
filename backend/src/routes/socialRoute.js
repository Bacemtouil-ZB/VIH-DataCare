import express from "express";
import {
  createSocialController,
  getSocialController,
  getSocialByPatientController,
  updateSocialController,

} from "../controllers/socialController.js";

import {
  protect,
  authorizeMedecin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/add",
  //protect,
  //authorizeMedecin,
  createSocialController
);


router.get(
  "/patient/:patientId",
  protect,
  authorizeMedecin,
  getSocialByPatientController
);

router.get(
  "/:id",
  protect,
  authorizeMedecin,
  getSocialController
);

router.put(
  "/update/:id",
  protect,
  authorizeMedecin,
  updateSocialController
);

export default router;