export const sanitizeText = (value) =>
  typeof value === "string" ? value.replace(/[<>]/g, "") : value;

export const normalizeNumero = (raw) => {
  let value = sanitizeText(raw);

  // retire le préfixe F- (géré par hospitalisation)
  value = value.replace(/^F-/, "");

  // garde uniquement chiffres et tiret
  value = value.replace(/[^0-9-]/g, "");

  // force le format : max 4 chiffres, tiret, max 4 chiffres
  const digits = value.replace(/-/g, "");

  if (digits.length <= 4) {
    // pas encore de tiret
    value = digits;
  } else {
    // insère tiret automatiquement après 3 ou 4 chiffres
    const part1 = digits.slice(0, 4); // max 4 chiffres avant tiret
    const part2 = digits.slice(4, 8); // max 4 chiffres après tiret
    value = part2 ? `${part1}-${part2}` : part1;
  }

  return value;
};

export const isNumeroValid = (numero) => {
  if (!numero) return true;
  const cleaned = String(numero).replace(/^F-/, "");
  return /^\d{3,4}-\d{4}$/.test(cleaned); //  3 OR 4 digits
};

export const validateNumeroYear = (numero) => {
  // Accept: 001-2025 OR 0001-2025 (with optional F- prefix)
  const cleaned = String(numero || "").replace(/^F-/, "");

  // allow 3 or 4 digits before the dash
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
