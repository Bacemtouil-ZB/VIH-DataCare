import apiClient from "./client";

// ============================================================
// CD4
// GET /api/suivi-biologique/:numero/graphique/cd4
// ============================================================
export const getGraphiqueCD4 = async (numero) => {
  const response = await apiClient.get(
    `/suivi-biologique/${numero}/graphique/cd4`
  );
  return response.data;
};

// ============================================================
// Charge virale
// GET /api/suivi-biologique/:numero/graphique/cv
// ============================================================
export const getGraphiqueCV = async (numero) => {
  const response = await apiClient.get(
    `/suivi-biologique/${numero}/graphique/cv`
  );
  return response.data;
};

// ============================================================
// Périodes ARV
// GET /api/suivi-biologique/:numero/periodes-arv
// ============================================================
export const getPeriodesARV = async (numero) => {
  const response = await apiClient.get(
    `/suivi-biologique/${numero}/periodes-arv`
  );
  return response.data;
};