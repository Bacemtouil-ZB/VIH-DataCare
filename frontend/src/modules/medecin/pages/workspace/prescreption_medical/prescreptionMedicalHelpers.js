import { STATUT_STYLE } from "./prescreptionMedicalConstants";

export function getStatutStyle(statut) {
  return STATUT_STYLE[statut] || { bg: "#f1f5f9", color: "#475569" };
}
