import express from "express";
import {
  getKpisController,
  getGraphiqueCD4Controller,
  getGraphiqueCVController,
  getPeriodesARVController,
  getTableauController,
} from "../controllers/Suivibiologiquecontroller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Zone 1 — KPIs + alertes
// GET /api/suivi-biologique/2222-2026/kpis
router.get("/:numero/kpis",           protect, getKpisController);

// Zone 2 — Graphiques
// GET /api/suivi-biologique/2222-2026/graphique/cd4
router.get("/:numero/graphique/cd4",  protect, getGraphiqueCD4Controller);
// GET /api/suivi-biologique/2222-2026/graphique/cv
router.get("/:numero/graphique/cv",   protect, getGraphiqueCVController);
// GET /api/suivi-biologique/2222-2026/periodes-arv
router.get("/:numero/periodes-arv",   protect, getPeriodesARVController);

// Zone 3 — Tableau
// GET /api/suivi-biologique/2222-2026/tableau
router.get("/:numero/tableau",        protect, getTableauController);

export default router;