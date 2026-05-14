
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
    throw error; 
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