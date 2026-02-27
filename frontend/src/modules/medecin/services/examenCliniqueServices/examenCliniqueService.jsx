import API from "../../../../shared/utils/api";


export const createExamenClinique = async (payload) => {
  try {
    const response = await API.post("/examen-clinique/add", payload);
    return response.data;
  } catch (error) {
    console.error("Erreur createExamenClinique:", error);
    throw error.response?.data || error.message;
  }
};

export const getExamensByPatient = async (numero) => {
  try {
    const response = await API.get(`/examen-clinique/patient/${numero}`);
    return response.data;
  } catch (error) {
    console.error("Erreur getExamensByPatient:", error);
    throw error.response?.data || error.message;
  }
};

// a manifesrter ;
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
  getExamensByPatient,
  updateExamen,
};