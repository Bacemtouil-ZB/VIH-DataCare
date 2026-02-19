import API from "../../../shared/utils/api";

export const findMedicalTreatmentByNumeroDossier = async (numeroDossier) => {
  try {
    const response = await API.get(`/ordonnances/numero-dossier/${numeroDossier}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const getThreeLastPrise = async (numeroDossier) => {
  try {
    const response = await API.get(`/ordonnances/patient/${numeroDossier}/last-three`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const getOrdonnanceById = async (id) => {
  try {
    const response = await API.get(`/ordonnances/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const updateDateProchainePrise = async (id, dateProchainePrise) => {
  try {
    const response = await API.patch(`/ordonnances/${id}/date-prochaine-prise`, {
      date_prochaine_prise: dateProchainePrise,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  findMedicalTreatmentByNumeroDossier,
  getThreeLastPrise,
  getOrdonnanceById,
  updateDateProchainePrise,
};