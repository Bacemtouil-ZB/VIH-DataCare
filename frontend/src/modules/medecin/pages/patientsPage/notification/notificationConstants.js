// notificationConstants.js

export const NOTIF_STORAGE_KEY = "notif_read_ids";
export const NOTIF_NEW_KEY     = "notif_seen_ids";   // pour le point rouge
export const NOTIF_REFRESH_MS  = 5 * 60 * 1000;      // refresh 5min
export const NOTIF_EXPIRY_DAYS = 7;                   // suppression auto 7j

export const NOTIF_TYPES = {
  MISSED:    "missed",
  SOON:      "soon",
  PHARMACIE: "pharmacie",
};

export const NOTIF_ICON_MAP = {
  missed:    "bi bi-calendar-x",
  soon:      "bi bi-calendar-check",
  pharmacie: "bi bi-capsule",
};

export const NOTIF_TITLE_MAP = {
  missed:    "RDV manqué",
  soon:      "RDV cette semaine",
  pharmacie: "Fixer le rendez-vous",
};