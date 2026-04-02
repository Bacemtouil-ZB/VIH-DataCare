import API from "../../../shared/utils/api";

// ── Zone 1 — KPIs + alertes ──────────────────────────────────────────────────
export const getKpisSuivi = async (numero) => {
  const res = await API.get(`suivi-biologique/${numero}/kpis`);
  return res.data; // { success, data: { cd4, cv, hemoglobine, statut, alertes } }
};

// ── Zone 2 — Graphique CD4 ───────────────────────────────────────────────────
export const getGraphiqueCD4 = async (numero) => {
  const res = await API.get(`suivi-biologique/${numero}/graphique/cd4`);
  return res.data; // { success, count, data: [...] }
};

// ── Zone 2 — Graphique CV ────────────────────────────────────────────────────
export const getGraphiqueCV = async (numero) => {
  const res = await API.get(`suivi-biologique/${numero}/graphique/cv`);
  return res.data; // { success, count, data: [...] }
};

// ── Zone 2 — Périodes ARV ────────────────────────────────────────────────────
export const getPeriodesARV = async (numero) => {
  const res = await API.get(`suivi-biologique/${numero}/periodes-arv`);
  return res.data; // { success, count, data: [...] }
};

// ── Zone 3 — Tableau chronologique ───────────────────────────────────────────
export const getTableauSuivi = async (numero) => {
  const res = await API.get(`suivi-biologique/${numero}/tableau`);
  return res.data; // { success, count, data: [...] }
};