// notificationHelpers.js

import {
  NOTIF_CLICKED_KEY,
  NOTIF_CLICK_EXPIRY_MS,
  NOTIF_ICON_MAP,
  NOTIF_TITLE_MAP,
  NOTIF_TITLE_COLOR_MAP,
} from "./notificationConstants.js";

// ── localStorage — lecture ────────────────────────────────────
export const loadFromStorage = (key, fallback = []) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

// ── localStorage — écriture ───────────────────────────────────
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // silent fail
  }
};

// ── clicked_at : enregistrer le clic ─────────────────────────
export const saveClickedAt = (notifId) => {
  const clicked = loadFromStorage(NOTIF_CLICKED_KEY, {});
  clicked[notifId] = Date.now();
  saveToStorage(NOTIF_CLICKED_KEY, clicked);
};

// ── clicked_at : vérifier si 24h dépassé ─────────────────────
export const isClickExpired = (notifId) => {
  const clicked = loadFromStorage(NOTIF_CLICKED_KEY, {});
  const ts = clicked[notifId];
  if (!ts) return false;
  return Date.now() - ts > NOTIF_CLICK_EXPIRY_MS;
};

// ── Visibilité d'une notif côté frontend ─────────────────────
// BD gère déjà l'expiration 7j → on filtre uniquement la règle 24h après clic
export const isNotifVisible = (notif) => {
  if (!notif.rdv_url) return true;           // sans lien → toujours visible
  return !isClickExpired(notif.notif_id);    // avec lien → masquer si 24h après clic
};

// ── Enrichir une notif brute du backend ──────────────────────
export const enrichNotif = (raw, readIds) => ({
  ...raw,
  isRead:  readIds.includes(raw.notif_id),
  icon:       NOTIF_ICON_MAP[raw.type]        ?? "bi bi-bell",
  title:      NOTIF_TITLE_MAP[raw.type]       ?? "Notification",
  titleClass: NOTIF_TITLE_COLOR_MAP[raw.type] ?? "",
  // message déjà construit par le backend dans buildNotifications()
});

//-- pour date de notification : format "il y a X min" ou "il y a 2h" ou "il y a 3j"
// ── Formater date notification ────────────────────────────────
export const formatNotifDate = (dateStr) => {
  const date = new Date(dateStr);
  const now  = new Date();
  const diffMs   = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffH    = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1)  return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffH    < 24) return `Il y a ${diffH}h`;
  if (diffDays === 1) return "Hier";
  return date.toLocaleDateString("fr-FR"); // ex: 19/04/2026
};