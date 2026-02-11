import API from "../config/api";

export const getNextNumero = async () => {
  try {
    const response = await API.get("/patients/next-numero");
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

export const getPatientById = async (id) => {
  try {
    const response = await API.get(`/patients/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const getPatientByNumero = async (numero) => {
  try {
    const response = await API.get(`/patients/numero/${numero}`);
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


export const getAllPatients = async () => {
  try {
    const response = await API.get("/patients/getAllPatients");
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


export const searchPatients = async (searchParams) => {
  try {
    // Filtrer les paramètres vides
    const params = Object.entries(searchParams)
      .filter(([_, value]) => value !== "" && value !== null && value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const response = await API.get("/patients/search", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const updateLastVisit = async (id) => {
  try {
    const response = await API.patch(`/patients/${id}/lastVisit`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};



// Export par défaut
export default {
  getNextNumero,
  createPatient,
  getPatientById,
  getPatientByNumero,
  checkNumeroExists,
  getAllPatients,
  updatePatient,
  searchPatients,
  updateLastVisit,
};