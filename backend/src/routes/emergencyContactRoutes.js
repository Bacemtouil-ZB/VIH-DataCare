// routes/emergencyContactRoutes.js

import express from "express";
import { getAll, getOne, create, update, remove } from "../controllers/emergencyContactController.js";
import { protect, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { smartProtect } from "../middlewares/smartProtect.js";

const router = express.Router();

// ── Mobile (lecture seule — tous les patients voient les contacts) ──
router.get("/mobile",       smartProtect, getAll);

// ── Web admin (CRUD complet) ──────────────────────────────────
router.get("/",             protect, authorizeAdmin, getAll);
router.get("/:id",          protect, authorizeAdmin, getOne);
router.post("/",            protect, authorizeAdmin, create);
router.put("/:id",          protect, authorizeAdmin, update);
router.delete("/:id",       protect, authorizeAdmin, remove);

export default router;