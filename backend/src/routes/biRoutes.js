// routes/biRoutes.js

import express from "express";
import {
  getNouveauxMaladesSummary,
  refreshMVs,
  getAnneesDisponibles

} from "../controllers/biController.js";
import { protect, authorizeAnalyste } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ── Nouveaux malades ──────────────────────────────────────────
router.get(
  "/nouveaux-malades/summary",
  protect,
  authorizeAnalyste,
  getNouveauxMaladesSummary
);

// ── Refresh MVs  ───────────────────────────
router.post(
  "/refresh",
  protect,
  authorizeAnalyste,
  refreshMVs
);

router.get(
  "/annees-disponibles",
  protect,
  authorizeAnalyste,
  getAnneesDisponibles
);


export default router;