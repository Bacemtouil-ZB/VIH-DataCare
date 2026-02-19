import API from "../../../shared/utils/api";

export const createPatient = async (patientData) => {
  try {
    const response = await API.post("/patients/add", patientData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// export const getPatientById = async (id) => {
//   try {
//     const response = await API.get(`/patients/${id}`);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };


export const getPatientByNumero = async (numero) => {
  try {
    const response = await API.get(`/patients/numero/${numero}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

  // export const checkNumeroExists = async (numero) => {
  //   try {
  //     const response = await API.get(`/patients/check/${numero}`);
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error.message;
  //   }
  // };


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

/**
 * Récupérer tous les médecins pour dropdown
 */
export const getAllDoctors = async () => {
  try {
    const response = await API.get("/users/doctors"); // correspond à ta route router.get("/doctors", protect, ...)
    return response.data.doctors; // attention, côté backend on renvoie { doctors: [...] }
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


// export const getAllAddresses = async () => {*
export const getAllAddresses = async () => {
  try {
    const response = await API.get("/addresses");
    return response.data.addresses; // tableau [{id, governorate, code_postal}, ...]
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


// export const updateLastVisit = async (id) => {
//   try {
//     const response = await API.patch(`/patients/${id}/lastVisit`);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };



// Export par défaut
export default {
  createPatient,
  // getPatientById,
  getPatientByNumero,
  //checkNumeroExists,
  getAllPatients,
  updatePatient,
  getAllDoctors,
  //updateLastVisit,
};