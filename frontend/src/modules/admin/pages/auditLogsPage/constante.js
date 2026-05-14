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

  "PATIENT_PRESCRIPTION_LIST_VIEW",

  "EXAMEN_CLINIQUE_CREATE",
  "EXAMEN_CLINIQUE_UPDATE",
  "EXAMEN_CLINIQUE_VIEW",

  "SUIVI_BIOLOGIQUE_KPIS_VIEW",
  "SUIVI_BIOLOGIQUE_CD4_VIEW",
  "SUIVI_BIOLOGIQUE_CV_VIEW",
  "SUIVI_BIOLOGIQUE_PERIODES_ARV_VIEW",
  "SUIVI_BIOLOGIQUE_TABLEAU_VIEW",

  "DOCTOR_CONCLUSION_CREATE",
  "DOCTOR_CONCLUSION_UPDATE",
  "DOCTOR_CONCLUSION_VIEW",
  "DOCTOR_CONCLUSION_LIST_VIEW",
"ANTECEDENT_FAMILIAL_VIEW",
"ANTECEDENT_FAMILIAL_CREATE",
"ANTECEDENT_FAMILIAL_UPDATE",

"ANTECEDENT_GYNECO_VIEW",
"ANTECEDENT_GYNECO_CREATE",
"ANTECEDENT_GYNECO_UPDATE",

"HABITUDE_DE_VIE_VIEW",
"HABITUDE_DE_VIE_CREATE",
"HABITUDE_DE_VIE_UPDATE",

"ANTECEDENT_MEDICAL_VIEW",
"ANTECEDENT_MEDICAL_CREATE",
"ANTECEDENT_MEDICAL_UPDATE",

"ANTECEDENT_CHIRURGICAL_VIEW",
"ANTECEDENT_CHIRURGICAL_CREATE",
"ANTECEDENT_CHIRURGICAL_UPDATE",
"ANTECEDENT_CHIRURGICAL_DELETE",

"ANTECEDENT_THERAPEUTIQUE_VIEW",
"ANTECEDENT_THERAPEUTIQUE_CREATE",
"ANTECEDENT_THERAPEUTIQUE_UPDATE",

"ANTECEDENT_TPE_PREP_VIEW",
"ANTECEDENT_TPE_PREP_CREATE",
"ANTECEDENT_TPE_PREP_UPDATE",
"ANTECEDENT_TPE_PREP_DELETE",

"ANTECEDENT_TRANSFUSION_VIEW",
"ANTECEDENT_TRANSFUSION_CREATE",
"ANTECEDENT_TRANSFUSION_UPDATE",
"ANTECEDENT_TRANSFUSION_DELETE",

];

export const DEFAULT_LIMIT = 50;
export const MAX_LIMIT = 200;
export const MIN_LIMIT = 1;

// ─── Groupement des actions par module ────────────────────────

export const ACTIONS_BY_MODULE = {
  AUTH: ["LOGIN_SUCCESS", "LOGIN_FAILED"],
  PATIENT: ["PATIENT_CREATE", "PATIENT_UPDATE", "PATIENT_VIEW"],
  SOCIAL: ["SOCIAL_CREATE", "SOCIAL_UPDATE", "SOCIAL_VIEW"],
  VIH: ["VIH_CREATE", "VIH_UPDATE", "VIH_VIEW"],
  OBSERVATION: ["OBSERVATION_CREATE", "OBSERVATION_UPDATE", "OBSERVATION_VIEW"],
  SIGNE_CLINIQUE: [
    "SIGNE_CLINIQUE_CREATE",
    "SIGNE_CLINIQUE_UPDATE",
    "SIGNE_CLINIQUE_VIEW",
  ],
  SIGNE_FONCTIONNEL: [
    "SIGNE_FONCTIONNEL_CREATE",
    "SIGNE_FONCTIONNEL_UPDATE",
    "SIGNE_FONCTIONNEL_VIEW",
  ],
  STOCK: ["STOCK_CREATE", "STOCK_UPDATE", "STOCK_VIEW", "STOCK_DELETE"],
  RENDEZ_VOUS: [
    "RENDEZ_VOUS_CREATE",
    "RENDEZ_VOUS_UPDATE",
    "RENDEZ_VOUS_VIEW",
  ],
  BILAN_EXAMEN: [
    "BILAN_EXAMEN_CREATE",
    "BILAN_EXAMEN_UPDATE",
    "BILAN_EXAMEN_VIEW",
  ],
  RESULTAT_BIOLOGIQUE: [
    "RESULTAT_BIOLOGIQUE_CREATE",
    "RESULTAT_BIOLOGIQUE_UPDATE",
    "RESULTAT_BIOLOGIQUE_VIEW",
  ],
  PRESCRIPTION: [
    "PRESCRIPTION_CREATE",
    "PRESCRIPTION_VALIDER",
    "PRESCRIPTION_VALIDER_MODIFIEE",
  ],
  PERMISSION: ["PERMISSION_SET"],
  PATIENT_PRESCRIPTION: ["PATIENT_PRESCRIPTION_LIST_VIEW"],
  EXAMEN_CLINIQUE: [
    "EXAMEN_CLINIQUE_CREATE",
    "EXAMEN_CLINIQUE_UPDATE",
    "EXAMEN_CLINIQUE_VIEW",
  ],
  SUIVI_BIOLOGIQUE: [
    "SUIVI_BIOLOGIQUE_KPIS_VIEW",
    "SUIVI_BIOLOGIQUE_CD4_VIEW",
    "SUIVI_BIOLOGIQUE_CV_VIEW",
    "SUIVI_BIOLOGIQUE_PERIODES_ARV_VIEW",
    "SUIVI_BIOLOGIQUE_TABLEAU_VIEW",
  ],
  DOCTOR_CONCLUSION: [
    "DOCTOR_CONCLUSION_CREATE",
    "DOCTOR_CONCLUSION_UPDATE",
    "DOCTOR_CONCLUSION_VIEW",
    "DOCTOR_CONCLUSION_LIST_VIEW",
  ],

ANTECEDENT_FAMILIAL: ["ANTECEDENT_FAMILIAL_VIEW", "ANTECEDENT_FAMILIAL_CREATE", "ANTECEDENT_FAMILIAL_UPDATE"],
ANTECEDENT_GYNECO: ["ANTECEDENT_GYNECO_VIEW", "ANTECEDENT_GYNECO_CREATE", "ANTECEDENT_GYNECO_UPDATE"],
HABITUDE_DE_VIE: ["HABITUDE_DE_VIE_VIEW", "HABITUDE_DE_VIE_CREATE", "HABITUDE_DE_VIE_UPDATE"],
ANTECEDENT_MEDICAL: ["ANTECEDENT_MEDICAL_VIEW", "ANTECEDENT_MEDICAL_CREATE", "ANTECEDENT_MEDICAL_UPDATE"],
ANTECEDENT_CHIRURGICAL: ["ANTECEDENT_CHIRURGICAL_VIEW", "ANTECEDENT_CHIRURGICAL_CREATE", "ANTECEDENT_CHIRURGICAL_UPDATE", "ANTECEDENT_CHIRURGICAL_DELETE"],
ANTECEDENT_THERAPEUTIQUE: ["ANTECEDENT_THERAPEUTIQUE_VIEW", "ANTECEDENT_THERAPEUTIQUE_CREATE", "ANTECEDENT_THERAPEUTIQUE_UPDATE"],
ANTECEDENT_TPE_PREP: ["ANTECEDENT_TPE_PREP_VIEW", "ANTECEDENT_TPE_PREP_CREATE", "ANTECEDENT_TPE_PREP_UPDATE", "ANTECEDENT_TPE_PREP_DELETE"],
ANTECEDENT_TRANSFUSION: ["ANTECEDENT_TRANSFUSION_VIEW", "ANTECEDENT_TRANSFUSION_CREATE", "ANTECEDENT_TRANSFUSION_UPDATE", "ANTECEDENT_TRANSFUSION_DELETE"],
};

// ─── Types d'actions ──────────────────────────────────────────

export const ACTION_TYPES = {
  CREATE: "CREATE",
  READ: "VIEW",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  VALIDATE: "VALIDER",
};

// ─── Icônes par module ────────────────────────────────────────

export const MODULE_ICONS = {
  AUTH: "bi-lock",
  PATIENT: "bi-person-fill",
  SOCIAL: "bi-people-fill",
  VIH: "bi-shield-check",
  OBSERVATION: "bi-eye",
  SIGNE_CLINIQUE: "bi-heart-pulse-fill",
  SIGNE_FONCTIONNEL: "bi-activity",
  STOCK: "bi-box",
  RENDEZ_VOUS: "bi-calendar-event",
  BILAN_EXAMEN: "bi-file-earmark-medical",
  RESULTAT_BIOLOGIQUE: "bi-flask",
  PRESCRIPTION: "bi-prescription",
  PERMISSION: "bi-key",
  PATIENT_PRESCRIPTION: "bi-receipt",
  EXAMEN_CLINIQUE: "bi-stethoscope",
  SUIVI_BIOLOGIQUE: "bi-graph-up",
  DOCTOR_CONCLUSION: "bi-file-text",
  ANTECEDENT_FAMILIAL: "bi-diagram-3",
  ANTECEDENT_GYNECO: "bi-heart-fill",
  HABITUDE_DE_VIE: "bi-person-heart",
  ANTECEDENT_MEDICAL: "bi-capsule",
  ANTECEDENT_CHIRURGICAL: "bi-bandaid",
  ANTECEDENT_THERAPEUTIQUE: "bi-prescription2",
  ANTECEDENT_TPE_PREP: "bi-shield-plus",
  ANTECEDENT_TRANSFUSION: "bi-droplet-half",

};

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
  PATIENT_PRESCRIPTION: "Prescription Patient",
  EXAMEN_CLINIQUE: "Examen Clinique",
  SUIVI_BIOLOGIQUE: "Suivi Biologique",
  DOCTOR_CONCLUSION: "Conclusion Médicale",
  ANTECEDENT_FAMILIAL: "Antécédent Familial",
  ANTECEDENT_GYNECO: "Antécédent Gynécologique",
  HABITUDE_DE_VIE: "Habitudes de Vie",
  ANTECEDENT_MEDICAL: "Antécédent Médical",
  ANTECEDENT_CHIRURGICAL: "Antécédent Chirurgical",
  ANTECEDENT_THERAPEUTIQUE: "Antécédent Thérapeutique",
  ANTECEDENT_TPE_PREP: "Antécédent TPE/PrEP",
  ANTECEDENT_TRANSFUSION: "Antécédent Transfusion",

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

  PATIENT_PRESCRIPTION_LIST_VIEW: "Consultation prescriptions patient",

  EXAMEN_CLINIQUE_CREATE: "Création examen clinique",
  EXAMEN_CLINIQUE_UPDATE: "Modification examen clinique",
  EXAMEN_CLINIQUE_VIEW: "Consultation examen clinique",

  SUIVI_BIOLOGIQUE_KPIS_VIEW: "Consultation KPIs biologiques",
  SUIVI_BIOLOGIQUE_CD4_VIEW: "Consultation graphique CD4",
  SUIVI_BIOLOGIQUE_CV_VIEW: "Consultation graphique charge virale",
  SUIVI_BIOLOGIQUE_PERIODES_ARV_VIEW: "Consultation périodes ARV",
  SUIVI_BIOLOGIQUE_TABLEAU_VIEW: "Consultation tableau biologique",

  DOCTOR_CONCLUSION_CREATE: "Création conclusion médicale",
  DOCTOR_CONCLUSION_UPDATE: "Modification conclusion médicale",
  DOCTOR_CONCLUSION_VIEW: "Consultation conclusion médicale",
  DOCTOR_CONCLUSION_LIST_VIEW: "Consultation liste conclusions",

  ANTECEDENT_FAMILIAL_VIEW: "Consultation antécédent familial",
ANTECEDENT_FAMILIAL_CREATE: "Création antécédent familial",
ANTECEDENT_FAMILIAL_UPDATE: "Modification antécédent familial",

ANTECEDENT_GYNECO_VIEW: "Consultation antécédent gynécologique",
ANTECEDENT_GYNECO_CREATE: "Création antécédent gynécologique",
ANTECEDENT_GYNECO_UPDATE: "Modification antécédent gynécologique",

HABITUDE_DE_VIE_VIEW: "Consultation habitudes de vie",
HABITUDE_DE_VIE_CREATE: "Création habitudes de vie",
HABITUDE_DE_VIE_UPDATE: "Modification habitudes de vie",

ANTECEDENT_MEDICAL_VIEW: "Consultation antécédent médical",
ANTECEDENT_MEDICAL_CREATE: "Création antécédent médical",
ANTECEDENT_MEDICAL_UPDATE: "Modification antécédent médical",

ANTECEDENT_CHIRURGICAL_VIEW: "Consultation antécédent chirurgical",
ANTECEDENT_CHIRURGICAL_CREATE: "Création antécédent chirurgical",
ANTECEDENT_CHIRURGICAL_UPDATE: "Modification antécédent chirurgical",
ANTECEDENT_CHIRURGICAL_DELETE: "Suppression antécédent chirurgical",

ANTECEDENT_THERAPEUTIQUE_VIEW: "Consultation antécédent thérapeutique",
ANTECEDENT_THERAPEUTIQUE_CREATE: "Création antécédent thérapeutique",
ANTECEDENT_THERAPEUTIQUE_UPDATE: "Modification antécédent thérapeutique",

ANTECEDENT_TPE_PREP_VIEW: "Consultation antécédent TPE/PrEP",
ANTECEDENT_TPE_PREP_CREATE: "Création antécédent TPE/PrEP",
ANTECEDENT_TPE_PREP_UPDATE: "Modification antécédent TPE/PrEP",
ANTECEDENT_TPE_PREP_DELETE: "Suppression antécédent TPE/PrEP",

ANTECEDENT_TRANSFUSION_VIEW: "Consultation antécédent transfusion",
ANTECEDENT_TRANSFUSION_CREATE: "Création antécédent transfusion",
ANTECEDENT_TRANSFUSION_UPDATE: "Modification antécédent transfusion",
ANTECEDENT_TRANSFUSION_DELETE: "Suppression antécédent transfusion",
};

// ─── Messages et textes génériques ────────────────────────────

export const MESSAGES = {
  // Titres et en-têtes
  pageTitle: "Audit patient",
  loading: "Chargement...",
  noData: "Aucune donnée disponible",
  noChanges: "Aucune modification enregistrée",
  
  // Actions
  search: "Rechercher",
  reset: "Réinitialiser",
  details: "Détails",
  close: "Fermer",
  
  // Filtres
  filterAll: "Tous",
  filterByModule: "Filtrer par module",
  filterByAction: "Filtrer par action",
  filterByDate: "Filtrer par date",
  from: "Du",
  to: "Au",
  
  // Validations
  formatError: "Format invalide (ex: 0001-2025)",
  requiredField: "Champ obligatoire",
  
  // Feedback utilisateur
  successSearch: "Recherche effectuée avec succès",
  errorSearch: "Erreur lors de la recherche",
  errorLoadDetails: "Erreur lors du chargement des détails",
  
  // Colonnes du tableau
  date: "Date",
  doctor: "Médecin",
  module: "Module",
  action: "Action",
  
  // Détails du log
  diffTitle: "Modifications",
  diffField: "Champ",
  diffOldValue: "Ancien",
  diffNewValue: "Nouveau",
  
  // Pagination
  page: "Page",
  of: "sur",
  recordsPerPage: "Enregistrements par page",
};

// ─── Configurations de pagination ──────────────────────────────

export const PAGINATION_OPTIONS = [
  { value: 10, label: "10 par page" },
  { value: 25, label: "25 par page" },
  { value: 50, label: "50 par page" },
  { value: 100, label: "100 par page" },
  { value: 200, label: "200 par page" },
];

// ─── Patterns et expressions régulières ───────────────────────

export const PATTERNS = {
  // Format numéro patient: AAAA-YYYY (4 chiffres - 4 chiffres)
  patientNumero: /^\d{4}-\d{4}$/,
  // Format date ISO
  isoDate: /\d{4}-\d{2}-\d{2}/,
};

// ─── Fonctions utilitaires ────────────────────────────────────

export const getModuleLabel = (module) => MODULE_LABELS[module] ?? module;
export const getActionLabel = (action) => ACTION_LABELS[action] ?? action;
export const getModuleColor = (module) => MODULE_COLORS[module] ?? "#666";
export const getModuleIcon = (module) => MODULE_ICONS[module] ?? "bi-question-circle";
export const getActionsByModule = (module) => ACTIONS_BY_MODULE[module] ?? [];
