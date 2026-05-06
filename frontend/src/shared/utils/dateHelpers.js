
const padDatePart = (value) => String(value).padStart(2, "0");

export const parseDateValue = (date) => {
  if (!date) return null;

  if (date instanceof Date) {
    return Number.isNaN(date.getTime()) ? null : new Date(date.getTime());
  }

  if (typeof date === "string") {
    const trimmed = date.trim();
    const dateOnlyMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (dateOnlyMatch) {
      const [, year, month, day] = dateOnlyMatch;
      const parsed = new Date(Number(year), Number(month) - 1, Number(day));
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
  }

  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Convertit n'importe quel format de date en "YYYY-MM-DD" (attendu par <input type="date">)
 */

export const toInputDate = (date) => {
  if (!date) return "";
  const d = parseDateValue(date);
  if (!d) return "";
  return `${d.getFullYear()}-${padDatePart(d.getMonth() + 1)}-${padDatePart(d.getDate())}`;
};

/**
 * Convertit une date en format français "DD/MM/YYYY"
 */
export const toFrDate = (date, fallback = "-") => {
  if (!date) return fallback;
  const d = parseDateValue(date);
  if (!d) return fallback;
  return d.toLocaleDateString("fr-FR");
};
/**
 * Convertit une date/heure en format français "DD/MM/YYYY HH:mm:ss"
 */
export const toFrDateTime = (date, fallback = "-") => {
  if (!date) return fallback;
  const d = parseDateValue(date);
  if (!d) return fallback;
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
  const birth = parseDateValue(dateNaissance);
  if (!birth) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};
