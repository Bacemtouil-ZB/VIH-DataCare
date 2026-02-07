import {
  updateUserActivationStatus,
  getAllUsers,
} from "../models/userModel.js";

/**
 * Récupère la liste de tous les utilisateurs
 * Réservé aux admins uniquement
 */
export const listAllUsers = async (roleFilter = null) => {
  const users = await getAllUsers(roleFilter);

  // Ne pas retourner les mots de passe
  return users.map((user) => {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};
/*
 * Réservé aux admins uniquement
 */
export const toggleUserActivation = async (userId, isActivated) => {
  const updatedUser = await updateUserActivationStatus(userId, isActivated);

  // Ne pas retourner le mot de passe
  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};
e;
