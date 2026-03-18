
/**
 * Convertit n'importe quel format de date en "YYYY-MM-DD" (attendu par <input type="date">)
 */
export const toInputDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0]; // "2026-03-10T00:00:00.000Z" → "2026-03-10"
};

/**
 * Convertit une date en format français "DD/MM/YYYY"
 */
export const toFrDate = (date, fallback = "-") => {
  if (!date) return fallback;
  const d = new Date(date);
  if (isNaN(d.getTime())) return fallback;
  return d.toLocaleDateString("fr-FR");
};
/**
 * Convertit une date/heure en format français "DD/MM/YYYY HH:mm:ss"
 */
export const toFrDateTime = (date, fallback = "-") => {
  if (!date) return fallback;
  const d = new Date(date);
  if (isNaN(d.getTime())) return fallback;
  return d.toLocaleString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

/**
 * Convertit une heure "HH:MM:SS" (PostgreSQL time) en "HH:MM" (attendu par <input type="time">)

 */
export const toInputTime = (heure) => {
  if (!heure) return "";
  return heure.slice(0, 5); // "09:30:00" → "09:30"
};

/**
 * Retourne l'âge en années depuis une date de naissance
 */
export const calcAge = (dateNaissance) => {
  if (!dateNaissance) return null;
  const birth = new Date(dateNaissance);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};