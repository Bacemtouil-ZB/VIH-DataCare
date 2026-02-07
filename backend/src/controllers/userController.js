import { toggleUserActivation, listAllUsers } from "../services/userService.js";
/**
 * Contrôleur pour activer/désactiver un utilisateur (admin uniquement)
 */
export const toggleActivationController = async (req, res) => {
  const { userId, isActivated } = req.body;

  try {
    const user = await toggleUserActivation(userId, isActivated);

    res.status(200).json({
      success: true,
      message: `Utilisateur ${isActivated ? "activé" : "désactivé"} avec succès`,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        isActivated: user.isactivated,
      },
    });
  } catch (error) {
    console.error("Toggle activation error:", error.message);
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
    console.error(" List users error:", error.message);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des utilisateurs",
    });
  }
};
