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
 * Request password change → triggers confirmation email
 */
export const updatePassword = async ({ currentPassword, newPassword }) => {
  try {
    const response = await API.post("/users/me/password-request", {
      currentPassword,
      newPassword,
    });
    return {
      success: true,
      message: response.data?.message,
    };
  } catch (error) {
    console.error("Erreur lors de la demande de changement de mot de passe:", error);
    throw new Error(
      error.response?.data?.message || "Erreur lors de la demande de changement de mot de passe"
    );
  }
};

/**
 * Confirm password change via token received by email
 */
export const confirmPasswordChange = async (token) => {
  try {
    const response = await API.put("/users/me/password/confirm", { token });
    return {
      success: true,
      message: response.data?.message,
    };
  } catch (error) {
    console.error("Erreur lors de la confirmation du mot de passe:", error);
    throw new Error(
      error.response?.data?.message || "Lien invalide ou expiré"
    );
  }
};