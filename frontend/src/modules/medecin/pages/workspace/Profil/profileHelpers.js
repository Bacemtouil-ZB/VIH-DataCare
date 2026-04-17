// cheked 15/04/2026
export const sanitizeText = (value) =>
  typeof value === "string" ? value.replace(/[<>]/g, "") : value;

export const normalizeNumero = (raw) => {
  // garder uniquement chiffres
  let value = raw.replace(/[^0-9]/g, "");

  // si vide → retourne vide
  if (!value) return "";

  const part1 = value.slice(0, 4);
  let part2 = value.slice(4, 8);

  // ── Gérer l'affichage du tiret ──
  // Si part2 vide → tiret “temporaire”, suppression possible
  if (!part2) {
    return value.length >= 4 ? part1 + "-" : part1;
  }

  // ── Si part2 contient au moins 1 chiffre → format strict ####-#### ──
  let result = `${part1}-${part2}`;

  // Bloquer année > année actuelle
 if (part2.length === 4) {
  const currentYear = new Date().getFullYear();
  const typedYear = Number(part2);

  // clamp future year
  if (typedYear > currentYear) {
    part2 = String(currentYear);
  }

  // optional: enforce minimum year
  if (typedYear < 1500) {
    part2 = "1500";
  }

  result = `${part1}-${part2}`;
}
  return result;
};
export const isNumeroValid = (numero) => {
  if (!numero) return true;
  const cleaned = String(numero).replace(/^F-/, "");
  return /^\d{4}-\d{4}$/.test(cleaned); // ← exactement 4 chiffres
};

export const validateNumeroYear = (numero) => {
  const cleaned = String(numero || "").replace(/^F-/, "");
  const match = cleaned.match(/^(\d{4})-(\d{4})$/); // ← exactement 4 chiffres
  if (!match) return null;

  const year = parseInt(match[2], 10);
  const currentYear = new Date().getFullYear();

  if (year > currentYear) {
    return `L'année doit être ≤ ${currentYear}`;
  }
  return null;
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
