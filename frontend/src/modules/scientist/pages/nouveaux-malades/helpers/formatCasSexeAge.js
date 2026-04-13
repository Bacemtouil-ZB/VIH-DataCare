import { TRANCHES_AGE, GENDERS } from "../constants/tranchesAge";

// Retourne le total toutes tranches confondues par genre
export const toKpiData = (casSexeAge) => {
  if (!casSexeAge) return null;

  const total = Object.values(casSexeAge.total ?? {}).reduce((s, v) => s + v, 0);

  return {
    total,
    homme:      Object.values(casSexeAge.homme      ?? {}).reduce((s, v) => s + v, 0),
    femme:      Object.values(casSexeAge.femme      ?? {}).reduce((s, v) => s + v, 0),
    transgenre: Object.values(casSexeAge.transgenre ?? {}).reduce((s, v) => s + v, 0),
  };
};

// Retourne tableau de barres groupées par tranche d'âge pour Recharts
export const toCasSexeAgeChartData = (casSexeAge) => {
  if (!casSexeAge) return [];

  return TRANCHES_AGE.map((tranche) => ({
    tranche,
    homme:      casSexeAge.homme?.[tranche]      ?? 0,
    femme:      casSexeAge.femme?.[tranche]      ?? 0,
    transgenre: casSexeAge.transgenre?.[tranche] ?? 0,
  }));
};