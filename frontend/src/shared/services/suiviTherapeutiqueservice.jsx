import API from "../utils/api";

export const getSuiviByPatientId = async (patientId) => {
  try {
    const response = await API.get(`/suivi-therapeutique/patient/${patientId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getSuiviByNumeroDossier = async (numeroDossier) => {
  try {
    const response = await API.get(`/suivi-therapeutique/numero/${numeroDossier}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  getSuiviByPatientId,
  getSuiviByNumeroDossier,

};