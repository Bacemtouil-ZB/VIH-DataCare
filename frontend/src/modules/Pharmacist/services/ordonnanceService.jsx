import API from "../../../shared/utils/api";

const normalizeOrdonnances = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.ordonnances)) return payload.ordonnances;
  if (Array.isArray(payload?.ordonnances?.ordonnances)) return payload.ordonnances.ordonnances;
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
    const response = await API.get(`/ordonnances/numero-dossier/${numeroDossier}`);
    const payload = response.data;
    return {
      success: true,
      ordonnances: normalizeOrdonnances(payload),
      patient: payload?.patient || payload?.ordonnances?.patient || null,
    };
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getThreeLastPrise = async (numeroDossier) => {
  try {
    const response = await API.get(`/ordonnances/patient/${numeroDossier}/last-three`);
    return normalizePrises(response.data);
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
