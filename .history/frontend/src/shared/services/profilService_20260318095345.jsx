// ─── profil.service.js ────────────────────────────────────────────────────────
// Replace API with your actual axios instance

import API from "../utils/api";

/**
 * Update current user's personal info (nom, prenom, email)
 */
export const updateProfile = async (data) => {
  try {
    const response = await API.put("/users/me", data);
    return {
      success: true,
      user: response.data,
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    throw new Error(
      error.response?.data?.message || "Erreur lors de la mise à jour du profil"
    );
  }
};

/**
 * Change current user's password
 */
export const updatePassword = async ({ currentPassword, newPassword }) => {
  try {
    const response = await API.put("/users/me/password", {
      currentPassword,
      newPassword,
    });
    return {
      success: true,
      message: response.data?.message,
    };
  } catch (error) {
    console.error("Erreur lors du changement de mot de passe:", error);
    throw new Error(
      error.response?.data?.message || "Erreur lors du changement de mot de passe"
    );
  }
};