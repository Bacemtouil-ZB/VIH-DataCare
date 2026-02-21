import API from "../../../shared/utils/api";

/**
 * ==========================================
 * SERVICE SIGNES CLINIQUES - FRONTEND
 * Avec fonction getSigneCliniqueByExamenId
 * ==========================================
 */

/**
 * Créer un signe clinique
 */
export const createSigneClinique = async (payload) => {
  try {
    const response = await API.post("/signesCliniques/add", payload);
    return response.data;
  } catch (error) {
    console.error("Erreur createSigneClinique:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Récupérer un signe clinique par ID
 */
export const getSigneCliniqueById = async (id) => {
  try {
    const response = await API.get(`/signesCliniques/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur getSigneCliniqueById:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Récupérer signes cliniques par numéro de dossier
 */
export const getSigneCliniqueByNumeroDossier = async (numeroDossier) => {
  try {
    const response = await API.get(`/signesCliniques/patient/${numeroDossier}`);
    return response.data;
  } catch (error) {
    console.error("Erreur getSigneCliniqueByNumeroDossier:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Récupérer signes cliniques par ID d'examen
 */
export const getSigneCliniqueByExamenId = async (examenId) => {
  try {
    const response = await API.get(`/signesCliniques/examen/${examenId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur getSigneCliniqueByExamenId:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Mettre à jour un signe clinique
 */
export const updateSigneClinique = async (id, payload) => {
  try {
    const response = await API.put(`/signesCliniques/update/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Erreur updateSigneClinique:", error);
    throw error.response?.data || error.message;
  }
};

export default {
  createSigneClinique,
  getSigneCliniqueById,
  getSigneCliniqueByNumeroDossier,
  getSigneCliniqueByExamenId, 
  updateSigneClinique,
};