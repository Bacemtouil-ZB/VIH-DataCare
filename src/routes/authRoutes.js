import express from "express";
import {
  loginController,
  registerController,
} from "../controllers/authController.js";
import {
  validateLogin,
  validateRegister,
  protect,
  authorizePharmacien,
  authorizeMedecin,
  authorizeAnalyste,
  authorize,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/login", validateLogin, loginController);
router.post("/register", validateRegister, registerController);

router.get("/admin/dashbord", protect, authorizeAdmin, (req, res) => {
  res.json({
    message: "Gestion des utilisateurs (Admin)",
    user: req.user
  });
});

router.get("/medecin/dashbord", protect, authorizeMedecin, (req, res) => {
  res.json({
    message: "Gestion des utilisateurs (medecin)",
    user: req.user
  });
});

router.get("/pharmacie/dashbord", protect, authorizePharmacien, (req, res) => {
  res.json({
    message: "Gestion des utilisateurs (pharmacie)",
    user: req.user
  });
});

router.get("/analyste/dashbord", protect, authorizeAnalyste, (req, res) => {
  res.json({
    message: "Gestion des utilisateurs (analyste)",
    user: req.user
  });
});

export default router;
