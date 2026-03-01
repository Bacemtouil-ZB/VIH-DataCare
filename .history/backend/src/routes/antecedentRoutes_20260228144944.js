import { Router } from "express";
import { protect, authorizeMedecin } from "../middlewares/authMiddleware.js";

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
  // versions
  getAntecedentVersions,
  getAntecedentVersionSnapshot,
  getAntecedentVersionSection,
} from "../controllers/antecedentController.js";

const router = Router();

// Header active (info version/status)
router.get(
  "/:numero/active",
  protect,
  authorizeMedecin,
  getActiveAntecedentHeader,
);

// Create new version (archive active + new header)
router.post(
  "/:numero/version",
  protect,
  authorizeMedecin,
  postNewAntecedentVersion,
);

// 1-1 sections
router.get("/:numero/active/medical", protect, authorizeMedecin, getMedical);
router.put("/:numero/active/medical", protect, authorizeMedecin, putMedical);

router.get(
  "/:numero/active/infectious",
  protect,
  authorizeMedecin,
  getInfectious,
);
router.put(
  "/:numero/active/infectious",
  protect,
  authorizeMedecin,
  putInfectious,
);

router.get(
  "/:numero/active/therapeutic",
  protect,
  authorizeMedecin,
  getTherapeutic,
);
router.put(
  "/:numero/active/therapeutic",
  protect,
  authorizeMedecin,
  putTherapeutic,
);

router.get("/:numero/active/family", protect, authorizeMedecin, getFamily);
router.put("/:numero/active/family", protect, authorizeMedecin, putFamily);

router.get("/:numero/active/gyneco", protect, authorizeMedecin, getGyneco);
router.put("/:numero/active/gyneco", protect, authorizeMedecin, putGyneco);

// 1-N sections (replace list)
router.get("/:numero/active/surgical", protect, authorizeMedecin, getSurgical);
router.put("/:numero/active/surgical", protect, authorizeMedecin, putSurgical);

router.get(
  "/:numero/active/transfusion",
  protect,
  authorizeMedecin,
  getTransfusion,
);
router.put(
  "/:numero/active/transfusion",
  protect,
  authorizeMedecin,
  putTransfusion,
);

router.get("/:numero/active/aes", protect, authorizeMedecin, getAes);
router.put("/:numero/active/aes", protect, authorizeMedecin, putAes);

export default router;
