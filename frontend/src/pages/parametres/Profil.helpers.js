// ─── profil.helpers.js ────────────────────────────────────────────────────────

import { PASSWORD_MIN_LENGTH } from "./Profil.constants.js";

/**
 * Build avatar initials from user object
 */
export const getInitials = (user) => {
  if (!user) return "?";
  return `${user.prenom?.[0] ?? ""}${user.nom?.[0] ?? ""}`.toUpperCase();
};

/**
 * Format ISO date to French locale string
 */
export const formatFrDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

/**
 * Check whether the info form differs from the saved user data
 */
export const hasInfoChanged = (form, user) => {
  if (!user) return false;
  return (
    form.nom !== user.nom ||
    form.prenom !== user.prenom ||
    form.email !== user.email
  );
};

/**
 * Validate personal info form → returns error map
 */
export const validateInfoForm = ({ nom, prenom, email }) => {
  const errors = {};

  if (!prenom?.trim()) errors.prenom = "Prénom requis";
  if (!nom?.trim()) errors.nom = "Nom requis";

  if (!email?.trim()) {
    errors.email = "Email requis";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Adresse email invalide";
  }

  return errors;
};

/**
 * Validate password change form → returns error map
 */
export const validatePwdForm = ({
  currentPassword,
  newPassword,
  confirmPassword,
}) => {
  const errors = {};

  if (!currentPassword) errors.currentPassword = "Mot de passe actuel requis";

  if (!newPassword) {
    errors.newPassword = "Nouveau mot de passe requis";
  } else if (newPassword.length < PASSWORD_MIN_LENGTH) {
    errors.newPassword = `Minimum ${PASSWORD_MIN_LENGTH} caractères`;
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirmation requise";
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = "Les mots de passe ne correspondent pas";
  }

  return errors;
};

/**
 * Map backend errors array to a field → message object
 * Expected shape: [{ field: string, message: string }]
 */
export const mapBackendErrors = (errorsArray) => {
  if (!Array.isArray(errorsArray)) return {};
  return errorsArray.reduce((acc, { field, message }) => {
    acc[field] = message;
    return acc;
  }, {});
};
