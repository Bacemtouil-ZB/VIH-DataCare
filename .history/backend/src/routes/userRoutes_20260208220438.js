import express from "express";
import {
  toggleActivationController,
  listUsersController,
  changeRoleController,
} from "../controllers/userController.js";
import {
  protect,
  authorizeAdmin,
  authorizePharmacien,
  authorizeMedecin,
  authorizeAnalyste,
} from "../middlewares/authMiddleware.js";
const router = express.Router();

// ── ROUTES ADMIN ──
router.post(
  "/admin/activation",
  protect,
  authorizeAdmin,
  toggleActivationController,
);

router.get("/admin/users", protect, authorizeAdmin, listUsersController);

router.get("/admin/dashbord", protect, authorizeAdmin, (req, res) => {
  res.json({
    message: "Gestion des utilisateurs (Admin)",
    user: req.user,
  });
});

router.post(
  "/admin/change-role",
  protect,
  authorizeAdmin,
  changeRoleController,
);
// ── ROUTES MÉDECIN
router.get("/medecin/dashbord", protect, authorizeMedecin, (req, res) => {
  res.json({
    message: "Gestion des utilisateurs (medecin)",
    user: req.user,
  });
});
// ── ROUTES PHARMACIEN
router.get("/pharmacie/dashbord", protect, authorizePharmacien, (req, res) => {
  res.json({
    message: "Gestion des utilisateurs (pharmacie)",
    user: req.user,
  });
});
// ── ROUTES ANALYSTE
router.get("/analyste/dashbord", protect, authorizeAnalyste, (req, res) => {
  res.json({
    message: "Gestion des utilisateurs (analyste)",
    user: req.user,
  });
});

export default router;
