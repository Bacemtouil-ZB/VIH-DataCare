// notificationHelpers.js

import { NOTIF_EXPIRY_DAYS, NOTIF_TITLE_MAP } from "./notificationConstants.js";

// ── Charger depuis localStorage ──
export const loadFromStorage = (key) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// ── Sauvegarder dans localStorage ──
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // silent
  }
};

// ── Calculer le type selon la date ──
export const getNotifType = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const in7days = new Date(today);
  in7days.setDate(today.getDate() + 7);

  const rdvDate = new Date(dateStr);
  rdvDate.setHours(0, 0, 0, 0);

  if (rdvDate < today)     return "missed";
  if (rdvDate <= in7days)  return "soon";
  return "pharmacie";
};

// ── Formater la date en français ──
export const formatDateFr = (dateStr) =>
  new Date(dateStr).toLocaleDateString("fr-FR");

// ── Enrichir une notif brute ──
export const enrichNotif = (raw, readIds, seenIds) => {
  const type = raw.type ?? getNotifType(raw.date_prochaine_prise);
  return {
    ...raw,
    type,
    isRead:  readIds.includes(raw.id),
    isNew:   !seenIds.includes(raw.id),
    title:   NOTIF_TITLE_MAP[type] ?? "Notification",
    message: `${raw.patient_name} ${raw.patient_surname} — N° ${raw.patient_numero}`,
    rdv_url: `/medecin/patient/${raw.patient_numero}/workspace/rendez-vous`,
  };
};

// ── Filtrer les notifs expirées (> 7 jours) ──
export const filterExpired = (notifs) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return notifs.filter((n) => {
    const rdvDate = new Date(n.date_prochaine_prise);
    rdvDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - rdvDate) / (1000 * 60 * 60 * 24));
    // garder si pas encore expirée (missed depuis moins de 7j ou future)
    return diffDays <= NOTIF_EXPIRY_DAYS;
  });
};