export const sanitizeText = (value) =>
  typeof value === "string" ? value.replace(/[<>]/g, "") : value;

export const normalizeNumero = (raw) => {
  let value = raw.replace(/[^0-9]/g, ""); // chiffres seulement

  // Partie 1 et partie 2
  const part1 = value.slice(0, 4);
  let part2 = value.slice(4, 8);

  // Ajout du tiret directement après 4 chiffres
  if (value.length === 4) {
    return part1 + "-"; // exactement 4 chiffres → tiret
  }

  // Bloque année supérieure à l'année actuelle
  if (part2.length === 4) {
    const currentYear = new Date().getFullYear();
    const typedYear = parseInt(part2, 10);
    if (typedYear > currentYear) {
      part2 = String(currentYear);
    }
  }

  return part2 ? `${part1}-${part2}` : part1;
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
