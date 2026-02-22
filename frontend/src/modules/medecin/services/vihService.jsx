import API from "../../../shared/utils/api";

/**
 * ==========================================
 * SERVICE VIH - FRONTEND CORRIGÉ
 * Gestion des données VIH du patient
 * ==========================================
 */

/**
 * Créer un dossier VIH
 * @param {Object} payload - Données du dossier VIH
 * @returns {Promise} Response data
 */
export const createVih = async (payload) => {
  try {
    const response = await API.post("/vih/add", payload);
    return response.data;
  } catch (error) {
    console.error("Erreur createVih:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Récupérer le dossier VIH par ID
 * @param {number} id - ID du dossier VIH
 * @returns {Promise} Response data
 */
export const getVihById = async (id) => {
  try {
    const response = await API.get(`/vih/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur getVihById:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Récupérer le dossier VIH par numéro de dossier patient
 * ⚠️ IMPORTANT: Le backend attend le numero dans l'URL
 * @param {string} numeroDossier - Numéro de dossier du patient (ex: "PAT-2025-001")
 * @returns {Promise} Response data
 */
export const getVihByNumeroDossier = async (numeroDossier) => {
  try {
    // Le backend utilise p.numero dans la requête SQL
    // La route est: /vih/patient/:numero
    const response = await API.get(`/vih/patient/${numeroDossier}`);
    return response.data;
  } catch (error) {
    console.error("Erreur getVihByNumeroDossier:", error);
    // Si pas de dossier VIH trouvé, retourner null au lieu de throw
    if (error.response?.status === 404) {
      return { success: false, vih: null };
    }
    throw error.response?.data || error.message;
  }
};

/**
 * Mettre à jour un dossier VIH
 * @param {number} id - ID du dossier VIH
 * @param {Object} payload - Données à mettre à jour
 * @returns {Promise} Response data
 */
export const updateVih = async (id, payload) => {
  try {
    const response = await API.put(`/vih/update/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Erreur updateVih:", error);
    throw error.response?.data || error.message;
  }
};

export default {
  createVih,
  getVihById,
  getVihByNumeroDossier,
  updateVih,
};