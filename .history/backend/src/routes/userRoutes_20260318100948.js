import express from "express";
import {
  toggleActivationController,
  listUsersController,
  changeRoleController,
  getAllDoctorsController,
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

// Route pour récupérer tous les médecins (pour les formulaires de sélection)
router.get("/doctors", protect, getAllDoctorsController);

//gestion du profil : update user info (nom, prenom, email, password)
import {
  updateMyProfileController,
  requestPasswordChangeController,
  confirmPasswordChangeController,
} from "../controllers/userController.js";

// ── ROUTES UTILISATEUR CONNECTÉ (me) ─────────────────────────────────────────

// Mettre à jour ses infos personnelles
router.put("/me", protect, updateMyProfileController);

// Demander le changement de mot de passe → envoie l'email
router.post("/me/password-request", protect, requestPasswordChangeController);

// Confirmer le changement via le lien email (token dans le body)
router.put("/me/password/confirm", confirmPasswordChangeController);
// ↑ pas de protect ici : l'utilisateur peut ne plus être connecté quand il clique
export default router;
