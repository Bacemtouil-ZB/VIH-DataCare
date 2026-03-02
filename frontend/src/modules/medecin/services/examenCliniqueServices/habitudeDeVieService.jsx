import API from "../../../../shared/utils/api";

export const createHabitudeDeVie = async (payload) => {
  try {
    const response = await API.post("/habitudes/add", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getHabitudeDeVieById = async (id) => {
  try {
    const response = await API.get(`/habitudes/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getHabitudeDeVieByNumeroDossier = async (numeroDossier) => {
  try {
    const response = await API.get(`/habitudes/patient/${numeroDossier}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateHabitudeDeVie = async (id, payload) => {
  try {
    const response = await API.put(`/habitudes/update/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  createHabitudeDeVie,
  getHabitudeDeVieById,
  getHabitudeDeVieByNumeroDossier,
  updateHabitudeDeVie,
};