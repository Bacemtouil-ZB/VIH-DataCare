import express from "express";
import {
  createVihController,
  getVihController,
<<<<<<< HEAD
  getVihByPatientController,
  updateVihController,
} from "../controllers/vihController.js";
import {
  validateCreateVih,
  validateUpdateVih,
} from "../middlewares/vihMiddleware.js";
=======
  getVihByNumeroDossierController,
  updateVihController,
} from "../controllers/vihController.js";

>>>>>>> origin/feature/vih
import {
  protect,
  authorizeMedecin,
} from "../middlewares/authMiddleware.js";
<<<<<<< HEAD

const router = express.Router();

router.get(
  "/patient/:patientId",
  protect,
  authorizeMedecin,
  getVihByPatientController
=======
import { validateCreateVih } from "../middlewares/vihMiddleware.js";
const router = express.Router();


router.get(
  "/patient/:numero",
  protect,
  authorizeMedecin,
  getVihByNumeroDossierController
>>>>>>> origin/feature/vih
);

router.post(
  "/add",
  protect,
<<<<<<< HEAD
  authorizeMedecin,
  validateCreateVih,
  createVihController
);

router.put(
  "/update/:id",
  protect,
  authorizeMedecin,
  validateUpdateVih,
=======
  authorizeMedecin,validateCreateVih,
  createVihController
);


router.put(
  "/update/:id",
  protect,
  authorizeMedecin,validateCreateVih,
>>>>>>> origin/feature/vih
  updateVihController
);


router.get(
  "/:id",
  protect,
  authorizeMedecin,
  getVihController
);

<<<<<<< HEAD

=======
>>>>>>> origin/feature/vih
export default router;