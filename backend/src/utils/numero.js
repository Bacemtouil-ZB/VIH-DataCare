export function stripNumeroPrefix(numero) {
  if (!numero) return "";
  return String(numero).trim().replace(/^F-/, "");
}

export function canonicalNumero(numero, hospitalisation) {
  const raw = stripNumeroPrefix(numero);
  if (!raw) return "";

  if (hospitalisation === "externe") return `F-${raw}`;
  return raw; // interne
}
