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
export const listAllDoctors = async () => {
  try {
    const doctors = await listAllDoctors();
    return doctors; // renvoie tableau [{id, nom, prenom, email}, ...]
  } catch (error) {
    console.error("Erreur listAllDoctors:", error);
    return []; // renvoyer tableau vide en cas d'erreur pour éviter de planter le frontend
  }
};
