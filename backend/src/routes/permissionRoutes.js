import express from "express";
import {
  setPermissionController,
  getPermissionController,
} from "../controllers/permissionController.js";
import {
  protect,
  authorizeMedecin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/permissions
router.post("/",protect, authorizeMedecin, setPermissionController);

// GET /api/permissions/:numero
router.get("/:numero", protect, authorizeMedecin, getPermissionController);

export default router;