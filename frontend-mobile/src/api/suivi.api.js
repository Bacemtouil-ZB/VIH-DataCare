// import apiClient from "./client";

// // ============================================================
// // CD4
// // GET /api/suivi-biologique/:numero/graphique/cd4
// // ============================================================
// export const getGraphiqueCD4 = async (numero) => {
//   const response = await apiClient.get(
//     `/suivi-biologique/${numero}/graphique/cd4`
//   );
//   return response.data;
// };

// // ============================================================
// // Charge virale
// // GET /api/suivi-biologique/:numero/graphique/cv
// // ============================================================
// export const getGraphiqueCV = async (numero) => {
//   const response = await apiClient.get(
//     `/suivi-biologique/${numero}/graphique/cv`
//   );
//   return response.data;
// };

// // ============================================================
// // Périodes ARV
// // GET /api/suivi-biologique/:numero/periodes-arv
// // ============================================================
// export const getPeriodesARV = async (numero) => {
//   const response = await apiClient.get(
//     `/suivi-biologique/${numero}/periodes-arv`
//   );
//   return response.data;
// };

import apiClient from "./client";

// Helper : intercepte 403 → retourne forbidden:true au lieu de crash
const safeFetch = async (url) => {
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    if (error?.response?.status === 403) {
      return { success: false, forbidden: true, data: [] };
    }
    throw error; // autres erreurs (500, réseau) → propagées normalement
  }
};

// ── CD4 ───────────────────────────────────────────────────────
export const getGraphiqueCD4 = (numero) =>
  safeFetch(`/suivi-biologique/${numero}/graphique/cd4`);

// ── Charge virale ─────────────────────────────────────────────
export const getGraphiqueCV = (numero) =>
  safeFetch(`/suivi-biologique/${numero}/graphique/cv`);

// ── Périodes ARV ──────────────────────────────────────────────
export const getPeriodesARV = (numero) =>
  safeFetch(`/suivi-biologique/${numero}/periodes-arv`);