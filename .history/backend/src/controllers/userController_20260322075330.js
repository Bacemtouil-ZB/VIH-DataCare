import {
  toggleUserActivation,
  listAllUsers,
  changeUserRole,
  listAllDoctors,
} from "../services/userService.js";
/**
 * Contrôleur pour activer/désactiver un utilisateur (admin uniquement)
 */
export const toggleActivationController = async (req, res) => {
  const { userId, isactivated } = req.body;

  try {
    // Validation
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId est requis",
      });
    }

    if (typeof isactivated !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActivated doit être un boolean",
      });
    }
    const user = await toggleUserActivation(userId, isactivated);

    res.status(200).json({
      success: true,
      message: `Utilisateur ${isactivated ? "activé" : "désactivé"} avec succès`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
/**
 * Contrôleur pour lister tous les utilisateurs (admin uniquement)
 */
export const listUsersController = async (req, res) => {
  try {
    const users = await listAllUsers();

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des utilisateurs",
    });
  }
};
// ── Changer rôle utilisateur
export const changeRoleController = async (req, res) => {
  const { userId, role } = req.body;
  try {
    const updatedUser = await changeUserRole(userId, role);
    if (!updatedUser) throw new Error("Utilisateur non trouvé");

    res.status(200).json({
      success: true,
      message: "Rôle mis à jour avec succès",
      user: updatedUser,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

//

// Service pour récupérer tous les médecins (pour les formulaires de sélection)
export const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await listAllDoctors();
    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error("Erreur listAllDoctors:", error);
    return []; // renvoyer tableau vide en cas d'erreur pour éviter de planter le frontend
  }
};
//gestion du profil : update user info (nom, prenom, email, password)
import {
  updateMyProfile,
  requestPasswordChange,
  confirmPasswordChange,
} from "../services/userService.js";

// ── Mettre à jour les infos personnelles ──────────────────────────────────────
export const updateMyProfileController = async (req, res) => {
  const { nom, prenom, email } = req.body;
  console.log("req.body:", req.body);
  console.log("req.user:", req.user);

  try {
    if (!nom || !prenom || !email) {
      return res.status(400).json({
        success: false,
        message: "nom, prenom et email sont requis",
      });
    }

    const user = await updateMyProfile(req.user.id, { nom, prenom, email });

    res.status(200).json({
      success: true,
      message: "Profil mis à jour avec succès",
      user,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── Demande de changement de mot de passe ─────────────────────────────────────
export const requestPasswordChangeController = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "currentPassword et newPassword sont requis",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Le nouveau mot de passe doit contenir au moins 8 caractères",
      });
    }

    await requestPasswordChange(req.user.id, { currentPassword, newPassword });

    res.status(200).json({
      success: true,
      message: "Un email de confirmation a été envoyé",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── Confirmation via le lien email ────────────────────────────────────────────
export const confirmPasswordChangeController = async (req, res) => {
  const { token } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ success: false, message: "Token requis" });
    }

    await confirmPasswordChange(token);

    res.status(200).json({
      success: true,
      message: "Mot de passe modifié avec succès",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
