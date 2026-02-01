import express from "express";
import {
  loginController,
  registerController,
  logoutController,
  toggleActivationController,
  listUsersController,
  
} from "../controllers/authController.js";
import {
  validateLogin,
  validateRegister,
  protect,
  authorizeAdmin,
  authorizePharmacien,
  authorizeMedecin,
  authorizeAnalyste,
} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/login", validateLogin, loginController);
router.post("/register", validateRegister, registerController);
router.post("/logout", protect, logoutController);

router.get("/admin/users", protect, authorizeAdmin, listUsersController);





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
