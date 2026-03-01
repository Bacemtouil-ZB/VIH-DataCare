import API from "../../../shared/utils/api";

/**
 * Path A: thin service (your style)
 * - No heavy sanitizers here
 * - Backend upsertOneToOne is robust (filters system keys)
 * - Pages (Antecedent.jsx) will map GET response -> form state shape
 */

export const getActiveAntecedent = async (numero) => {
  try {
    const response = await API.get(`/antecedents/${numero}/active`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const postNewAntecedentVersion = async (numero) => {
  try {
    const response = await API.post(`/antecedents/${numero}/version`);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};


// 1-1
export const getMedical = async (numero) => {
  try {
    const response = await API.get(`/antecedents/${numero}/active/medical`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateMedical = async (numero, medicalData) => {
  try {
    const response = await API.put(`/antecedents/${numero}/active/medical`, medicalData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getInfectious = async (numero) => {
  try {
    const response = await API.get(`/antecedents/${numero}/active/infectious`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateInfectious = async (numero, infectiousData) => {
  try {
    const response = await API.put(`/antecedents/${numero}/active/infectious`, infectiousData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getTherapeutic = async (numero) => {
  try {
    const response = await API.get(`/antecedents/${numero}/active/therapeutic`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateTherapeutic = async (numero, therapeuticData) => {
  try {
    const response = await API.put(`/antecedents/${numero}/active/therapeutic`, therapeuticData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getFamily = async (numero) => {
  try {
    const response = await API.get(`/antecedents/${numero}/active/family`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateFamily = async (numero, familyData) => {
  try {
    const response = await API.put(`/antecedents/${numero}/active/family`, familyData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getGyneco = async (numero) => {
  try {
    const response = await API.get(`/antecedents/${numero}/active/gyneco`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateGyneco = async (numero, gynecoData) => {
  try {
    const response = await API.put(`/antecedents/${numero}/active/gyneco`, gynecoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 1-N
export const getSurgical = async (numero) => {
  try {
    const response = await API.get(`/antecedents/${numero}/active/surgical`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const replaceSurgical = async (numero, surgicalRows) => {
  try {
    const response = await API.put(`/antecedents/${numero}/active/surgical`, surgicalRows);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getTransfusion = async (numero) => {
  try {
    const response = await API.get(`/antecedents/${numero}/active/transfusion`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const replaceTransfusion = async (numero, transfusionRows) => {
  try {
    const response = await API.put(`/antecedents/${numero}/active/transfusion`, transfusionRows);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAes = async (numero) => {
  try {
    const response = await API.get(`/antecedents/${numero}/active/aes`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const replaceAes = async (numero, aesRows) => {
  try {
    const response = await API.put(`/antecedents/${numero}/active/aes`, aesRows);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

//------------------- versions-----------------
const throwServiceError = (error) => {
  throw error?.response?.data || error?.message || "Erreur réseau";
};

// NEW: list versions (headers only)
export const getAntecedentVersions = async (numero) => {
  try {
    const response = await API.get(`/antecedents/${numero}/versions`);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

// NEW: snapshot for a specific version_number
export const getAntecedentVersionSnapshot = async (numero, versionNumber) => {
  try {
    const response = await API.get(
      `/antecedents/${numero}/versions/${versionNumber}`,
    );
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export default {
  getActiveAntecedent,
  postNewAntecedentVersion,
  getAntecedentVersions,
  getAntecedentVersionSnapshot,

  getMedical,
  updateMedical,
  getInfectious,
  updateInfectious,
  getTherapeutic,
  updateTherapeutic,
  getFamily,
  updateFamily,
  getGyneco,
  updateGyneco,

  getSurgical,
  replaceSurgical,
  getTransfusion,
  replaceTransfusion,
  getAes,
  replaceAes,
};