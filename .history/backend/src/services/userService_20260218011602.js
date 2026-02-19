import {
  updateUserActivationStatus,
  getAllUsers,
  updateUserRole,
  getAllDoctors,
} from "../models/userModel.js";

/**
 * Récupère la liste de tous les utilisateurs
 * Réservé aux admins uniquement
 */
export const listAllUsers = async () => {
  const users = await getAllUsers();

  // Ne pas retourner les mots de passe
  return users.map((user) => {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};
/*
 * Réservé aux admins uniquement
 */
export const toggleUserActivation = async (userId, isactivated) => {
  const updatedUser = await updateUserActivationStatus(userId, isactivated);
  if (!updatedUser) {
    throw new Error("Utilisateur non trouvé");
  }

  // Ne pas retourner le mot de passe
  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};
// ── Service pour changer le rôle d'un utilisateur
export const changeUserRole = async (userId, role) => {
  // Ici tu peux ajouter des validations supplémentaires si besoin
  if (!["admin", "medecin", "pharmacien", "analyste"].includes(role)) {
    throw new Error("Rôle invalide");
  }

  const updatedUser = await updateUserRole(userId, role);
  if (!updatedUser) {
    throw new Error("Utilisateur non trouvé");
  }

  return updatedUser;
};

// Service pour récupérer tous les médecins (pour les formulaires de sélection)
export const listAllDoctors = async () => {
  const doctors = await getAllDoctors();
  return doctors; // renvoie tableau [{id, nom, prenom, email}, ...]
};
