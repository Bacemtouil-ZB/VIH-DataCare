import API from "../../../shared/utils/api";

export const getPatientByNumero = async (numero) => {
  try {
    const response = await API.get(`/patients/numero/${numero}`);
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

export const getAllPatients = async () => {
  try {
    const response = await API.get("/patients/getAllPatients");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createPatient = async (patientData) => {
  try {
    const response = await API.post("/patients/add", patientData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const updatePatient = async (id, patientData) => {
  try {
    const response = await API.put(`/patients/update/${id}`, patientData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const checkNumeroExists = async (numero) => {
  try {
    const response = await API.get(`/patients/check/${numero}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  getPatientByNumero,
  getAllPatients,
  createPatient,
  updatePatient,
  checkNumeroExists,
};