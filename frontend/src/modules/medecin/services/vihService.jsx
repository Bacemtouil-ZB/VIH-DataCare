import API from "../../../shared/utils/api";

export const createVih = async (payload) => {
  try {
    const response = await API.post("/vih/add", payload);
    return response.data;
  } catch (error) {
    console.error("Erreur createVih:", error);
    throw error.response?.data || error.message;
  }
};

export const getVihById = async (id) => {
  try {
    const response = await API.get(`/vih/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur getVihById:", error);
    throw error.response?.data || error.message;
  }
};

export const getPatientByNumero = async (numero) => {
  try {
    const response = await API.get(`/patients/numero/${numero}`);
    return response.data;
  } catch (error) {
    console.error("Erreur getPatientByNumero:", error);
    throw error.response?.data || error.message;
  }
};

export const getVihByNumero = async (numero) => {
  try {
    const response = await API.get(`/vih/patient/${numero}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, vih: null };
    }
    console.error("Erreur getVihByNumero:", error);
    throw error.response?.data || error.message;
  }
};

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
  getPatientByNumero,
  getVihByNumero,
  updateVih,
};
