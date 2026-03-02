// this to handle the numero field in the profile form, to add F- prefix if hospitalisation is externe and remove it if it's not
export function normalizeNumero(numero) {
  if (!numero) return numero;
  return String(numero).trim().replace(/^F-/, "");
}
