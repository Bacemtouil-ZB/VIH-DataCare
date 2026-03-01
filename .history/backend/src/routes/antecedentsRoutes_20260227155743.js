import { Router } from "express";
import {
  protect,
  authorizeMedecin,
  authorizePharmacien,
} from "../middlewares/authMiddleware.js";

import {
  getActiveAntecedentHeader,
  postNewAntecedentVersion,
  // 1-1
  getMedical,
  putMedical,
  getInfectious,
  putInfectious,
  getTherapeutic,
  putTherapeutic,
  getFamily,
  putFamily,
  getGyneco,
  putGyneco,
  // 1-N
  getSurgical,
  putSurgical,
  getTransfusion,
  putTransfusion,
  getAes,
  putAes,
} from "../controllers/antecedentController.js";

const router = Router();

// Header active (info version/status)
router.get(
  "/patients/:numero/antecedents/active",
  protect,
  authorizeMedecin,
  getActiveAntecedentHeader,
);

// Create new version (archive active + new header)
router.post(
  "/patients/:numero/antecedents/version",
  protect,
  authorizeMedecin,
  postNewAntecedentVersion,
);

// 1-1 sections
router.get(
  "/patients/:numero/antecedents/active/medical",
  protect,
  authorizeMedecin,
  getMedical,
);
router.put(
  "/patients/:numero/antecedents/active/medical",
  protect,
  authorizeMedecin,
  putMedical,
);

router.get(
  "/patients/:numero/antecedents/active/infectious",
  protect,
  authorizeMedecin,
  getInfectious,
);
router.put(
  "/patients/:numero/antecedents/active/infectious",
  protect,
  authorizeMedecin,
  putInfectious,
);

router.get(
  "/patients/:numero/antecedents/active/therapeutic",
  protect,
  authorizeMedecin,
  getTherapeutic,
);
router.put(
  "/patients/:numero/antecedents/active/therapeutic",
  protect,
  authorizeMedecin,
  putTherapeutic,
);

router.get(
  "/patients/:numero/antecedents/active/family",
  protect,
  authorizeMedecin,
  getFamily,
);
router.put(
  "/patients/:numero/antecedents/active/family",
  protect,
  authorizeMedecin,
  putFamily,
);

router.get(
  "/patients/:numero/antecedents/active/gyneco",
  protect,
  authorizeMedecin,
  getGyneco,
);
router.put(
  "/patients/:numero/antecedents/active/gyneco",
  protect,
  authorizeMedecin,
  putGyneco,
);

// 1-N sections (replace list)
router.get(
  "/patients/:numero/antecedents/active/surgical",
  protect,
  authorizeMedecin,
  getSurgical,
);
router.put(
  "/patients/:numero/antecedents/active/surgical",
  protect,
  authorizeMedecin,
  putSurgical,
);

router.get(
  "/patients/:numero/antecedents/active/transfusion",
  protect,
  authorizeMedecin,
  getTransfusion,
);
router.put(
  "/patients/:numero/antecedents/active/transfusion",
  protect,
  authorizeMedecin,
  putTransfusion,
);

router.get(
  "/patients/:numero/antecedents/active/aes",
  protect,
  authorizeMedecin,
  getAes,
);
router.put(
  "/patients/:numero/antecedents/active/aes",
  protect,
  authorizeMedecin,
  putAes,
);

export default router;
