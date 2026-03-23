// ─── profil.constants.js ──────────────────────────────────────────────────────

export const ROLE_LABELS = {
  medecin: "Médecin",
  admin: "Administrateur",
  infirmier: "Infirmier(e)",
  secretaire: "Secrétaire",
};

export const PASSWORD_MIN_LENGTH = 8;

export const SECTIONS = {
  INFO: "info",
  PASSWORD: "password",
};

export const TOAST_MESSAGES = {
  INFO_SUCCESS: "Profil mis à jour avec succès",
  INFO_ERROR: "Erreur lors de la mise à jour du profil",
  PWD_SUCCESS: "Un email de confirmation a été envoyé à votre adresse",
  PWD_ERROR: "Mot de passe actuel incorrect",
};

export const INITIAL_INFO_FORM = {
  nom: "",
  prenom: "",
  email: "",
};

export const INITIAL_PWD_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};
