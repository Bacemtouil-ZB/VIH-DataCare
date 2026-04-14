import { TRANCHES_AGE }              from "../constants/tranchesAge";
import { SEUILS_CD4, SEUILS_CD4_LABELS } from "../constants/seuilsCd4";

// Retourne tableau de barres empilées par tranche d'âge pour Recharts
export const toDiagnosticTardifChartData = (diagnosticTardif) => {
  if (!diagnosticTardif) return [];

  return TRANCHES_AGE.map((tranche) => {
    const entry = { tranche };
    for (const seuil of SEUILS_CD4) {
      entry[seuil] = diagnosticTardif.total?.[tranche]?.[seuil] ?? 0;
    }
    return entry;
  });
};