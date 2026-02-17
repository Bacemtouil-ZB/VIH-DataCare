import API from "../../../shared/utils/api";

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
    const response = await api.get(`/patients/numero/${numero}`);
    return {
      success: true,
      patient: response.data,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du patient:", error);
    throw new Error(
      error.response?.data?.message || "Erreur lors de la récupération du patient"
    );
  }
};
export const getPatientByNumeroPharmacien = async (numero) => {
  try {
    const response = await API.get(`/patients/pharmacien/numero/${numero}`);
    return {
      success: true,
      patient: response.data,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du patient:", error);
    throw new Error(
      error.response?.data?.message || "Erreur lors de la récupération du patient"
    );
  }
};

export default {
  getAllPatients,
  getPatientByNumeroPharmacien,
  getPatientByNumero
};