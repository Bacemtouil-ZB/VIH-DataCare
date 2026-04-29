import express from 'express';
import {
  getNouveauxMalades,
  getFileActive,
  getAnnees,
  refreshMVs,
} from '../controllers/biController.js';
import { protect, authorizeAnalyste } from "../middlewares/authMiddleware.js";

const router = express.Router();

;

// GET /api/bi/annees
// Années disponibles depuis v_dim_temps
router.get('/annees', getAnnees);

// GET /api/bi/nouveaux-malades?annee=2025
// GET /api/bi/nouveaux-malades?annee=2025&trimestre=1
router.get('/nouveaux-malades', getNouveauxMalades);

// GET /api/bi/file-active?annee=2025
router.get('/file-active', protect, getFileActive);

// POST /api/bi/refresh

router.post('/refresh', protect,authorizeAnalyste, refreshMVs);

export default router;