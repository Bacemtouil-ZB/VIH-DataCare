// ══════════════════════════════════════════════════════════════
// 🔧 Layer 1 — Constantes & Configuration
// ══════════════════════════════════════════════════════════════

// ── Formulaire ────────────────────────────────────────────────
export const INITIAL_FORM = {
  medicament_ids: [],
  traitement: "",
  posologie: "",
  periode: "",
  remarque: "",
};

// ── Statuts ───────────────────────────────────────────────────
export const STATUT_LABELS = {
  envoyee: "Envoyee",
  delivree: "Delivree",
};

export const STATUT_STYLE = {
  envoyee: { bg: "#fef9c3", color: "#854d0e" },
  delivree: { bg: "#dcfce7", color: "#166534" },
};

// ── Textes UI ─────────────────────────────────────────────────
export const UI_TEXTS = {
  pageTitle: "Prescription medicale",
  searchPlaceholder: "Rechercher un medicament, ..",
  addButton: "Ajouter",
  cancelButton: "Annuler",
  createLabel: "Nouvelle prescription medicale",
  modifyLabel: "Modifier la prescription",
  detailsLabel: "Details de la prescription",
  submitCreate: "Confirmer",
  submitModify: "Mettre a jour",
  selectMedicines: "Sélectionner des médicaments...",
  noResults: "Aucun résultat",
  validateButton: "Valider",
  closeButton: "Fermer",
  emptyHistory: "Aucune prescription enregistree.",
  historyTitle: "Historique des prescriptions medicales",
};

// ── Table Headers ─────────────────────────────────────────────
export const TABLE_HEADERS = ["Date", "Médicaments", "Posologie", "Durée (j)", "Statut", "Action"];

// ── Form Fields ───────────────────────────────────────────────
export const FORM_FIELDS = {
  medicaments: {
    label: "Médicaments",
    placeholder: "Ex : Aspirine 500mg",
  },
  posologie: {
    label: "Posologie",
    placeholder: "Ex : 500 mg",
  },
  periode: {
    label: "Durée (jours)",
    placeholder: "Nombre de jours",
    min: 1,
  },
  remarque: {
    label: "Remarque",
    placeholder: "Observations ou instructions complementaires (optionnel)",
  },
};

// ── Detail Fields ─────────────────────────────────────────────
export const DETAIL_FIELDS = [
  "Date",
  "Posologie",
  "Durée (jours)",
  "Statut",
  "Remarque",
];

// ── Validation Messages ───────────────────────────────────────
export const VALIDATION_MESSAGES = {
  noMedicines: "Veuillez selectionner au moins un medicament.",
  invalidPeriod: "La duree prescrite doit etre superieure a 0.",
  successCreate: "Prescription envoyee a la pharmacie.",
  successValidate: "Prescription validee avec succes.",
  errorLoad: "Impossible de charger les donnees.",
  errorSave: "Erreur lors de l'enregistrement.",
  errorValidate: "Erreur lors de la validation.",
};