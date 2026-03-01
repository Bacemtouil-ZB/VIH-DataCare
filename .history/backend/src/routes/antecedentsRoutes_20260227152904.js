import { Router } from "express";
import requireAuth from "../middlewares/auth.js";
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
  requireAuth,
  getActiveAntecedentHeader,
);

// Create new version (archive active + new header)
router.post(
  "/patients/:numero/antecedents/version",
  requireAuth,
  postNewAntecedentVersion,
);

// 1-1 sections
router.get(
  "/patients/:numero/antecedents/active/medical",
  requireAuth,
  getMedical,
);
router.put(
  "/patients/:numero/antecedents/active/medical",
  requireAuth,
  putMedical,
);

router.get(
  "/patients/:numero/antecedents/active/infectious",
  requireAuth,
  getInfectious,
);
router.put(
  "/patients/:numero/antecedents/active/infectious",
  requireAuth,
  putInfectious,
);

router.get(
  "/patients/:numero/antecedents/active/therapeutic",
  requireAuth,
  getTherapeutic,
);
router.put(
  "/patients/:numero/antecedents/active/therapeutic",
  requireAuth,
  putTherapeutic,
);

router.get(
  "/patients/:numero/antecedents/active/family",
  requireAuth,
  getFamily,
);
router.put(
  "/patients/:numero/antecedents/active/family",
  requireAuth,
  putFamily,
);

router.get(
  "/patients/:numero/antecedents/active/gyneco",
  requireAuth,
  getGyneco,
);
router.put(
  "/patients/:numero/antecedents/active/gyneco",
  requireAuth,
  putGyneco,
);

// 1-N sections (replace list)
router.get(
  "/patients/:numero/antecedents/active/surgical",
  requireAuth,
  getSurgical,
);
router.put(
  "/patients/:numero/antecedents/active/surgical",
  requireAuth,
  putSurgical,
);

router.get(
  "/patients/:numero/antecedents/active/transfusion",
  requireAuth,
  getTransfusion,
);
router.put(
  "/patients/:numero/antecedents/active/transfusion",
  requireAuth,
  putTransfusion,
);

router.get("/patients/:numero/antecedents/active/aes", requireAuth, getAes);
router.put("/patients/:numero/antecedents/active/aes", requireAuth, putAes);

export default router;
