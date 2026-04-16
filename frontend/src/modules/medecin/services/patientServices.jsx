//cheked 15/04/2026
import API from "../../../shared/utils/api";
export const createPatient = async (patientData) => {
  try {
    const response = await API.post("/patients/add", patientData);
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

// used in patients list page, to get the list of patients for the doctor
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
 * this is not in the patientRoutes, but in userRoutes, but since we need it in the patient form.
 */
export const getAllDoctors = async () => {
  try {
    const response = await API.get("/doctors"); // correspond à ta route router.get("/doctors", protect, ...)
    return response.data.doctors; // attention, côté backend on renvoie { doctors: [...] }
  } catch (error) {
    throw error.response?.data || error.message;
  }
};



//Récupère toutes les données nécessaires pour le formulaire :
// - la liste des gouvernorats + leurs codes postaux associés
// from backend/src/routes/addressRoutes.js : router.get("/form-data", getFormData);
export const getFormData = async () => {
  try {
    const response = await API.get("/addresses/form-data");
    // renvoie directement les tableaux pour le formulaire
    return {
      governorates: response.data.governorates || [],
      postalCodes: response.data.postal_codes || []
    };
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// from backend/src/routes/patientRoutes.js : router.get("/check/:numero", checkNumeroExistsController);
export const checkPatientNumero = async (numero) => {
  try {
    const response = await API.get(`/patients/check/${numero}`);
    return response.data; // { exists: boolean, patient: object | null }
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ─── MOBILE ACCESS ────────────────────────────────────────────────────────────

export const getMobileAccountStatus = async (numero) => {
  try {
    const response = await API.get(`/mobile/patient/account-status/${numero}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createMobileAccount = async (numero) => {
  try {
    const response = await API.post(`/mobile/patient/create-account/${numero}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const resetMobilePassword = async (numero) => {
  try {
    const response = await API.put(`/mobile/patient/reset-password/${numero}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


// Export par défaut
export default {
  createPatient,
  getPatientByNumero,
  getAllPatients,
  updatePatient,
  getAllDoctors,
  getFormData,
  checkPatientNumero ,
  getMobileAccountStatus,
  createMobileAccount,
  resetMobilePassword,
};