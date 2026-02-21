import API from "../../../shared/utils/api";

// Récupérer la fiche sociale par numéro de patient
export const getSocialByNumero = async (numero) => {
  try {
    const response = await API.get(`/social/${numero}`);
    return response.data.social;
  } catch (error) {
    // Si 404, retourner null au lieu de throw (pas de fiche = normal)
    if (error.response?.status === 404) {
       return Promise.resolve({ data: null });
    }
    throw error.response?.data || error.message;
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
  console.log("Body reçu :", socialData);
  console.log("Probleme:", socialData.probleme);
  console.log("Type:", typeof socialData.probleme);
  try {
    const response = await API.put(`/social/${numero}`, socialData);
    return response.data.social;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};