import express from "express";
import {
  listGlobalAuditLogsController,
  listPatientAuditLogsController,
  getAuditLogDetailsController,
} from "../controllers/auditController.js";
import { protect, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Global audit logs (table view)
router.get(
  "/admin/logs",
  protect,
  authorizeAdmin,
  listGlobalAuditLogsController,
);

// Patient audit logs by exact numero (table view)
router.get(
  "/admin/patient/:numero",
  protect,
  authorizeAdmin,
  listPatientAuditLogsController,
);

// Details (modal)
router.get(
  "/admin/logs/:id",
  protect,
  authorizeAdmin,
  getAuditLogDetailsController,
);

export default router;
