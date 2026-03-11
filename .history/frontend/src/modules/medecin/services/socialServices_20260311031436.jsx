import API from "../../../shared/utils/api";

// Récupérer la fiche sociale par numéro de patient
export const getSocialByNumero = async (numero) => {
  try {
    const response = await API.get(`/social/${numero}`);
    return response.data.social;
  } catch (error) {
    // 404 ou 400 → pas de fiche = normal
    if (
      error.response?.status === 404 ||
      error.response?.status === 400
    ) {
      return null; // ← retourne null au lieu de throw
    }
    throw error; // ← throw l'erreur complète
  }
};


// Créer une fiche sociale
export const createSocial = async (numero, socialData) => {
  try {
    const response = await API.post(`/social/${numero}`, socialData);
    return response.data.social;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Mettre à jour une fiche sociale
export const updateSocial = async (numero, socialData) => {
  try {
    const response = await API.put(`/social/${numero}`, socialData);
    return response.data.social;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};