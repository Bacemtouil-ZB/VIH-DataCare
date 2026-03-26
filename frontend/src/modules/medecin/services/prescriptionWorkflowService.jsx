import API from "../../../shared/utils/api";


export const addMedicalTreatment = async (treatmentData) => {
  try {
    const response = await API.post("/prescriptions-medicales/add", treatmentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const findMedicalTreatmentByNumeroDossier = async (numeroDossier) => {
  try {
    const response = await API.get(`/prescriptions-medicales/numero-dossier/${numeroDossier}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getThreeLastPrise = async (numeroDossier) => {
  try {
    const response = await API.get(`/prescriptions-medicales/patient/${numeroDossier}/last-three`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getTreatmentStartDate = async (prescriptionId) => {
  try {
    const response = await API.get(`/prescriptions-medicales/${prescriptionId}/start-date`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getNextIntakeDate = async (prescriptionId) => {
  try {
    const response = await API.get(`/prescriptions-medicales/${prescriptionId}/next-date`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPrescriptionById = async (id) => {
  try {
    const response = await API.get(`/prescriptions-medicales/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updatePrescription = async (id, data) => {
  try {
    const response = await API.put(`/prescriptions-medicales/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateDateProchainePrise = async (id, dateProchainePrise) => {
  try {
    const response = await API.patch(`/prescriptions-medicales/${id}/date-prochaine-prise`, {
      date_prochaine_prise: dateProchainePrise,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPatientsPerduDeVue = async () => {
  try {
    const response = await API.get("/prescriptions-medicales/perdus-de-vue");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getStatistiques = async () => {
  try {
    const response = await API.get("/prescriptions-medicales/stats");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const validatePrescription = async (id) => {
  try {
    const response = await API.patch(`/prescriptions-medicales/${id}/valider`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  addMedicalTreatment,
  findMedicalTreatmentByNumeroDossier,
  getThreeLastPrise,
  getTreatmentStartDate,
  getNextIntakeDate,
  getPrescriptionById,
  updatePrescription,
  updateDateProchainePrise,
  getPatientsPerduDeVue,
  getStatistiques,
  validatePrescription,
};
