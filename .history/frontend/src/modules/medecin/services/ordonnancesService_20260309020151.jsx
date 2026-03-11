import API from "../../../shared/utils/api";

// =========================
// CONCLUSIONS MÉDICALES
// =========================

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

// =========================
// ORDONNANCES MÉDICALES
// =========================

export const addMedicalTreatment = async (treatmentData) => {
  try {
    const response = await API.post("/ordonnances/add", treatmentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

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

export const getTreatmentStartDate = async (ordonnanceId) => {
  try {
    const response = await API.get(`/ordonnances/${ordonnanceId}/start-date`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getNextIntakeDate = async (ordonnanceId) => {
  try {
    const response = await API.get(`/ordonnances/${ordonnanceId}/next-date`);
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

export const updateOrdonnance = async (id, data) => {
  try {
    const response = await API.put(`/ordonnances/${id}`, data);
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

export const getPatientsPerduDeVue = async () => {
  try {
    const response = await API.get("/ordonnances/perdus-de-vue");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getStatistiques = async () => {
  try {
    const response = await API.get("/ordonnances/stats");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// =========================
// EXPORT
// =========================

export default {
  listPatientConclusions,
  createPatientConclusion,
  updateConclusion,
  getConclusionDetails,
  addMedicalTreatment,
  findMedicalTreatmentByNumeroDossier,
  getThreeLastPrise,
  getTreatmentStartDate,
  getNextIntakeDate,
  getOrdonnanceById,
  updateOrdonnance,
  updateDateProchainePrise,
  getPatientsPerduDeVue,
  getStatistiques,
};