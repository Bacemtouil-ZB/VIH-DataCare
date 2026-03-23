// ─── profil.constants.js ──────────────────────────────────────────────────────

export const ROLE_LABELS = {
  medecin: "Médecin",
  admin: "Administrateur",
  infirmier: "Infirmier(e)",
};

export const PASSWORD_MIN_LENGTH = 8;

export const SECTIONS = {
  INFO: "info",
  PASSWORD: "password",
};

export const TOAST_MESSAGES = {
  INFO_LOADING: "Mise à jour du profil...",
  INFO_SUCCESS: "Profil mis à jour avec succès",
  INFO_ERROR: "Impossible de mettre à jour le profil",

  NO_CHANGES: "Aucune modification détectée",

  VALIDATION_ERROR: "Veuillez corriger les champs",

  PWD_LOADING: "Mise à jour du mot de passe...",
  PWD_SUCCESS: "Mot de passe modifié • Vérifiez votre email",
  PWD_ERROR: "Mot de passe actuel incorrect ou invalide",
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
