import API from "../../../shared/utils/api";

const normalizePrescriptions = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.prescriptions)) return payload.prescriptions;
  if (Array.isArray(payload?.prescriptions?.prescriptions)) return payload.prescriptions.prescriptions;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const normalizePrises = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.prises)) return payload.prises;
  if (Array.isArray(payload?.prises?.prises)) return payload.prises.prises;
  return [];
};

export const findMedicalTreatmentByNumeroDossier = async (numeroDossier) => {
  try {
    const response = await API.get(`/prescriptions-medicales/numero-dossier/${numeroDossier}`);
    const payload = response.data;
    return {
      success: true,
      prescriptions: normalizePrescriptions(payload),
      patient: payload?.patient || payload?.prescriptions?.patient || null,
    };
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getThreeLastPrise = async (numeroDossier) => {
  try {
    const response = await API.get(`/prescriptions-medicales/patient/${numeroDossier}/last-three`);
    return normalizePrises(response.data);
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

export const validatePrescription = async (id) => {
  try {
    const response = await API.patch(`/prescriptions-medicales/${id}/valider`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  findMedicalTreatmentByNumeroDossier,
  getThreeLastPrise,
  getPrescriptionById,
  updateDateProchainePrise,
  validatePrescription,
};
