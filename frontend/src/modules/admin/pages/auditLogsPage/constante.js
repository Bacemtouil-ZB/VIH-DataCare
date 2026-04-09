// doit etre up to date avec le changement de logs fait dans le backend
export const ACTIONS = [
  "LOGIN_SUCCESS",
  "LOGIN_FAILED",

  "PATIENT_CREATE",
  "PATIENT_UPDATE",
  "PATIENT_VIEW",

  "SOCIAL_CREATE",
  "SOCIAL_UPDATE",
  "SOCIAL_VIEW",

  "VIH_CREATE",
  "VIH_UPDATE",
  "VIH_VIEW",


  "OBSERVATION_CREATE",
  "OBSERVATION_UPDATE",
  "OBSERVATION_VIEW",

  "SIGNE_CLINIQUE_VIEW",
  "SIGNE_CLINIQUE_UPDATE",
  "SIGNE_CLINIQUE_CREATE",

  "SIGNE_FONCTIONNEL_VIEW",
  "SIGNE_FONCTIONNEL_UPDATE",
  "SIGNE_FONCTIONNEL_CREATE",

  "STOCK_CREATE",
  "STOCK_UPDATE",
  "STOCK_VIEW",
  "STOCK_DELETE",

  "RENDEZ_VOUS_CREATE",
  "RENDEZ_VOUS_UPDATE",
  "RENDEZ_VOUS_VIEW",

  "BILAN_EXAMEN_CREATE",
  "BILAN_EXAMEN_VIEW",
  "BILAN_EXAMEN_UPDATE",

  "RESULTAT_BIOLOGIQUE_CREATE",
  "RESULTAT_BIOLOGIQUE_VIEW",
  "RESULTAT_BIOLOGIQUE_UPDATE",

  "PRESCRIPTION_CREATE",
  "PRESCRIPTION_VALIDER",
  "PRESCRIPTION_VALIDER_MODIFIEE",

  "PERMISSION_SET",
];

export const DEFAULT_LIMIT = 50;

// ─── Labels français ───────────────────────────────────────────

export const MODULE_LABELS = {
  AUTH: "Authentification",
  PATIENT: "Patient",
  SOCIAL: "Situation Sociale",
  VIH: "VIH",
  OBSERVATION: "Observation",
  SIGNE_CLINIQUE: "Signe Clinique",
  SIGNE_FONCTIONNEL: "Signe Fonctionnel",
  STOCK: "Stock",
  RENDEZ_VOUS: "Rendez-vous",
  BILAN_EXAMEN: "Bilan Examen",
  RESULTAT_BIOLOGIQUE: "Résultat Biologique",
  PRESCRIPTION: "Prescription",
  PERMISSION: "Permission",
};

export const ACTION_LABELS = {
  LOGIN_SUCCESS: "Connexion réussie",
  LOGIN_FAILED: "Échec de connexion",

  PATIENT_CREATE: "Création patient",
  PATIENT_UPDATE: "Modification patient",
  PATIENT_VIEW: "Consultation patient",

  SOCIAL_CREATE: "Création situation sociale",
  SOCIAL_UPDATE: "Modification situation sociale",
  SOCIAL_VIEW: "Consultation situation sociale",

  VIH_CREATE: "Création dossier VIH",
  VIH_UPDATE: "Modification dossier VIH",
  VIH_VIEW: "Consultation dossier VIH",


  OBSERVATION_CREATE: "Création observation",
  OBSERVATION_UPDATE: "Modification observation",
  OBSERVATION_VIEW: "Consultation observation",


  SIGNE_CLINIQUE_CREATE: "Création signe clinique",
  SIGNE_CLINIQUE_UPDATE: "Modification signe clinique",
  SIGNE_CLINIQUE_VIEW: "Consultation signe clinique",

  SIGNE_FONCTIONNEL_CREATE: "Création signe fonctionnel",
  SIGNE_FONCTIONNEL_UPDATE: "Modification signe fonctionnel",
  SIGNE_FONCTIONNEL_VIEW: "Consultation signe fonctionnel",

  STOCK_CREATE: "Création stock",
  STOCK_UPDATE: "Modification stock",
  STOCK_VIEW: "Consultation stock",
  STOCK_DELETE: "Suppression stock",

  RENDEZ_VOUS_CREATE: "Création rendez-vous",
  RENDEZ_VOUS_UPDATE: "Modification rendez-vous",
  RENDEZ_VOUS_VIEW: "Consultation rendez-vous",

  BILAN_EXAMEN_CREATE: "Création bilan examen",
  BILAN_EXAMEN_VIEW: "Consultation bilan examen",
  BILAN_EXAMEN_UPDATE: "Modification bilan examen",

  RESULTAT_BIOLOGIQUE_CREATE: "Création résultat biologique",
  RESULTAT_BIOLOGIQUE_VIEW: "Consultation résultat biologique",
  RESULTAT_BIOLOGIQUE_UPDATE: "Modification résultat biologique",

  PRESCRIPTION_CREATE: "Création prescription",
  PRESCRIPTION_VALIDER: "Validation prescription",
  PRESCRIPTION_VALIDER_MODIFIEE: "Validation prescription modifiée",

  PERMISSION_SET: "Définition permission",
};

export const getModuleLabel = (module) => MODULE_LABELS[module] ?? module;
export const getActionLabel = (action) => ACTION_LABELS[action] ?? action;