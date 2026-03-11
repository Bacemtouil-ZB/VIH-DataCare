import API from "../../../shared/utils/api";

export const listPatientConclusions = async (numero) => {
  try {
    const response = await API.get(`/medecin/patients/${numero}/conclusions`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createPatientConclusion = async (numero, { content }) => {
  try {
    const response = await API.post(`/medecin/patients/${numero}/conclusions`, { content });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateConclusion = async (id, { content }) => {
  try {
    const response = await API.put(`/medecin/conclusions/${id}`, { content });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getConclusionDetails = async (id) => {
  try {
    const response = await API.get(`/medecin/conclusions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};