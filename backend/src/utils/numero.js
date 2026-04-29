//cheked 15/04/2026
export function stripNumeroPrefix(numero) {
  if (!numero) return "";
  return String(numero).trim().replace(/^F-/, ""); // enlève le préfixe "F-" s'il existe, pour éviter les doublons (F-123 vs 123)
}

//Si patient externe → on force le préfixe "F-"
//Si patient interne → on garde le numéro sans préfixe

export function canonicalNumero(numero, hospitalisation) {
  const raw = stripNumeroPrefix(numero);
  if (!raw) return "";

  if (hospitalisation === "externe") return `F-${raw}`;
  return raw; // interne
}
