import API from "../../../shared/utils/api";

const normalizePatient = (payload) =>
  payload?.patient?.patient || payload?.patient || payload || null;

export const getAllPatients = async () => {
  try {
    const response = await API.get("/patients/getAllPatients");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPatientByNumero = async (numero) => {
  try {
    const response = await API.get(`/patients/numero/${numero}`);
    return {
      success: true,
      patient: normalizePatient(response.data),
    };
  } catch (error) {
    console.error("Erreur lors de la recuperation du patient:", error);
    throw error.response?.data || error.message;
  }
};

// Conserve l'API existante cote composants, mais utilise la meme route backend.
export const getPatientByNumeroPharmacien = async (numero) => {
  return getPatientByNumero(numero);
};

export default {
  getAllPatients,
  getPatientByNumeroPharmacien,
  getPatientByNumero,
};
