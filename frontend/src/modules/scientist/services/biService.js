import API from "../../../shared/utils/api";

// ── Nouveaux malades — summary complet ───────────────────────
// retourne : { casSexeAge, diagnosticTardif, populationsCles }
export const getNouveauxMaladesSummary = async ({ annee, trimestre }) => {
  const params = { annee };
  if (trimestre) params.trimestre = trimestre;

  const res = await API.get("bi/nouveaux-malades/summary", { params });
  return res.data; // { success, data: { casSexeAge, diagnosticTardif, populationsCles } }
};
// ── Années disponibles ────────────────────────────────────────
export const getAnneesDisponibles = async () => {
  const res = await API.get("bi/annees-disponibles");
  return res.data; // { success, data: [2024, 2023, 2022, ...] }
};

// ── Refresh MVs  ───────────────────────────
export const refreshBiMVs = async () => {
  const res = await API.post("bi/refresh");
  return res.data; // { success, data: { refreshedAt } }
};