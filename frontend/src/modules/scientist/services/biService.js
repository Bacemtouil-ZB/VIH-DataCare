import API from "../../../shared/utils/api";

// ── Années disponibles ────────────────────────────────────────
// GET /api/bi/annees
export const getAnneesDisponibles = async () => {
  const res = await API.get("bi/annees");
  return res.data; // { success, data: [2025, 2024, ...] }
};

// ── Nouveaux malades ──────────────────────────────────────────
// GET /api/bi/nouveaux-malades?annee=2025
// GET /api/bi/nouveaux-malades?annee=2025&trimestre=1
// retourne : { nouveaux_depistes, diagnostic_tardif, populations_cles }
export const getNouveauxMaladesSummary = async ({ annee, trimestre }) => {
  const params = { annee };
  if (trimestre) params.trimestre = trimestre;

  const res = await API.get("bi/nouveaux-malades", { params });
  return res.data; // { success, data: { meta, nouveaux_depistes, diagnostic_tardif, populations_cles } }
};

// ── File active ───────────────────────────────────────────────
// GET /api/bi/file-active?annee=2025
// retourne : { total_file_active, cv_controle, cascade_virale,
//              deces, retention, transferts, migrants }
export const getFileActiveSummary = async ({ annee }) => {
  const res = await API.get("bi/file-active", { params: { annee } });
  return res.data; // { success, data: { meta, total_file_active, ... } }
};

// ── Refresh MVs ───────────────────────────────────────────────
// POST /api/bi/refresh  
export const refreshBiMVs = async () => {
  const res = await API.post("bi/refresh");
  return res.data; // { success, data: { refreshed, timestamp } }
};