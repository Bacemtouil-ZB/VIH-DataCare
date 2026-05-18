import express from 'express';
import {
  getNouveauxMalades,
  getFileActive,
  getAnnees,
  refreshMVs,
} from '../controllers/biController.js';
import { protect, authorizeAnalyste } from "../middlewares/authMiddleware.js";

const router = express.Router();




router.get('/annees', getAnnees);


router.get('/nouveaux-malades', getNouveauxMalades);

// GET /api/bi/file-active?annee=2025
router.get('/file-active', protect, getFileActive);

// POST /api/bi/refresh

router.post('/refresh', protect,authorizeAnalyste, refreshMVs);

export default router;