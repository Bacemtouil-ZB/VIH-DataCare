export const sanitizeText = (value) =>
  typeof value === "string" ? value.replace(/[<>]/g, "") : value;

export const normalizeNumero = (raw) => {
  let value = sanitizeText(raw);

  // user shouldn't type F- manually (controlled by hospitalisation)
  value = value.replace(/^F-/, "");
  // keep only digits + dash
  value = value.replace(/[^0-9-]/g, "");

  return value;
};

export const isNumeroValid = (numero) => {
  if (!numero) return true;
  const cleaned = String(numero).replace(/^F-/, "");
  return /^\d{3,4}-\d{4}$/.test(cleaned); // ✅ 3 OR 4 digits
};

export const validateNumeroYear = (numero) => {
  // Accept: 001-2025 OR 0001-2025 (with optional F- prefix)
  const cleaned = String(numero || "").replace(/^F-/, "");

  // ✅ allow 3 or 4 digits before the dash
  const match = cleaned.match(/^(\d{3,4})-(\d{4})$/);
  if (!match) return;

  const year = parseInt(match[2], 10);
  const currentYear = new Date().getFullYear();

  if (year > currentYear) {
    return `L'année doit être ≤ ${currentYear}`;
  }
};
const normalizeGov = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

export const filterPostalCodesByGovernorate = (postalCodes, governorate) => {
  const wanted = normalizeGov(governorate);
  return (postalCodes || []).filter(
    (pc) => normalizeGov(pc.governorate) === wanted,
  );
};
