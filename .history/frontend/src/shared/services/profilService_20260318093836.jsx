// ─── profil.service.js ────────────────────────────────────────────────────────
// Replace API with your actual axios instance

import API from "@/services/api"; // your axios instance

/**
 * Update current user's personal info (nom, prenom, email)
 */
export const updateProfile = async (data) => {
  try {
    const response = await API.put("/users/me", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
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
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};