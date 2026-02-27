import API from "../../../../shared/utils/api";

export const getObservationsByPatient = async (numero) => {
  try {
    const response = await API.get(`/observations/patient/${numero}`);
    return response.data;
  } catch (error) {
    console.error("Erreur getObservationsByPatient:", error);
    throw error.response?.data || error.message;
  }
};

export const createObservation = async (payload) => {
  try {
    const response = await API.post("/observations/add", payload);
    return response.data;
  } catch (error) {
    console.error("Erreur createObservation:", error);
    throw error.response?.data || error.message;
  }
};

export const updateObservation = async (id, payload) => {
  try {
    const response = await API.put(`/observations/update/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Erreur updateObservation:", error);
    throw error.response?.data || error.message;
  }
};

export default {
  getObservationsByPatient,
  createObservation,
  updateObservation,
};