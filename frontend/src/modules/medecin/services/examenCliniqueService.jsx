import API from "../../../shared/utils/api";

/**
 * ==========================================
 * SERVICE EXAMEN CLINIQUE - FRONTEND
 * ==========================================
 */

/**
 * Créer un examen clinique
 */
export const createExamenClinique = async (payload) => {
  try {
    const response = await API.post("/examen-clinique/add", payload);
    return response.data;
  } catch (error) {
    console.error("Erreur createExamenClinique:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Récupérer un examen par ID
 */
export const getExamenById = async (id) => {
  try {
    const response = await API.get(`/examen-clinique/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur getExamenById:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Récupérer tous les examens d'un patient
 */
export const getExamensByPatient = async (numero) => {
  try {
    const response = await API.get(`/examen-clinique/patient/${numero}`);
    return response.data;
  } catch (error) {
    console.error("Erreur getExamensByPatient:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Mettre à jour un examen
 */
export const updateExamen = async (id, payload) => {
  try {
    const response = await API.put(`/examen-clinique/update/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Erreur updateExamen:", error);
    throw error.response?.data || error.message;
  }
};

export default {
  createExamenClinique,
  getExamenById,
  getExamensByPatient,
  updateExamen,
};