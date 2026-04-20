// notificationConstants.js

// ── localStorage keys ──────────────────────────────────────────
export const NOTIF_READ_KEY    = "notif_read_ids";    // ids lus par médecin
export const NOTIF_CLICKED_KEY = "notif_clicked";     // { [notif_id]: timestamp }

// ── Polling ───────────────────────────────────────────────────
export const NOTIF_REFRESH_MS  = 5 * 60 * 1000;      // refresh toutes les 5min depuis bd appeller de api 

// ── Règle 24h après clic ──────────────────────────────────────
export const NOTIF_CLICK_EXPIRY_MS = 24 * 60 * 60 * 1000;

// ── Types (correspondent exactement au backend) ───────────────
export const NOTIF_TYPES = {
  DELIVRANCE:              "delivrance",
  EN_RETARD:               "en_retard",
  PERDU_DE_VUE:            "perdu_de_vue",
  ALERTE:                  "alerte",
  PRESCRIPTION_NON_VALIDEE:"prescription_non_validee",
  RDV_MANQUE:              "rdv_manque",
  RDV_PROCHE:              "rdv_proche",
};

export const NOTIF_TITLE_MAP = {
  delivrance:               "Traitement délivré",
  en_retard:                "Patient en retard",
  perdu_de_vue:             "Patient perdu de vue",
  alerte:                   "Délivrance anormale — vérifier statut", 
  prescription_non_validee: "Prescription expirée",
  rdv_manque:               "RDV manqué",
  rdv_proche:               "RDV proche",
};

export const NOTIF_ICON_MAP = {
  delivrance:               "bi bi-capsule",
  en_retard:                "bi bi-clock-history",
  perdu_de_vue:             "bi bi-person-dash",
  alerte:                   "bi bi-exclamation-octagon",    
  prescription_non_validee: "bi bi-file-earmark-x",
  rdv_manque:               "bi bi-calendar-x",
  rdv_proche:               "bi bi-calendar-check",
};