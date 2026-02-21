import API from "../../../shared/utils/api";


export const getAppareils = async () => {
  try {
    const response = await API.get("/signesFonctionnels/appareils");
    return response.data;
  } catch (error) {
    console.error("Erreur getAppareils:", error);
    throw error.response?.data || error.message;
  }
};

export const getSignesByPatient = async (numero) => {
  try {
    const response = await API.get(`/signesFonctionnels/patient/${numero}`);
    return response.data;
  } catch (error) {
    console.error("Erreur getSignesByPatient:", error);
    throw error.response?.data || error.message;
  }
};


export const getSignesByExamen = async (examenId) => {
  try {
    const response = await API.get(`/signesFonctionnels/examen/${examenId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur getSignesByExamen:", error);
    throw error.response?.data || error.message;
  }
};

export const createSignesFonctionnels = async (payload) => {
  try {
    const response = await API.post("/signesFonctionnels/add", payload);
    return response.data;
  } catch (error) {
    console.error("Erreur createSignesFonctionnels:", error);
    throw error.response?.data || error.message;
  }
};

export const updateSignesFonctionnels = async (examenId, payload) => {
  try {
    const response = await API.put(
      `/signesFonctionnels/update/${examenId}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Erreur updateSignesFonctionnels:", error);
    throw error.response?.data || error.message;
  }
};

export default {
  getAppareils,
  getSignesByPatient,
  getSignesByExamen,
  createSignesFonctionnels,
  updateSignesFonctionnels,
};