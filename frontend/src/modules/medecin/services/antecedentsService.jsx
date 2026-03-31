import API from "../../../shared/utils/api";

const throwServiceError = (error) => {
  throw error?.response?.data || error?.message || "Erreur réseau";
};

// ─────────────────────────────────────────────
// Antécédent Familial
// ─────────────────────────────────────────────
export const getFamily = async (numero) => {
  try {
    const response = await API.get(`/antecedents/family/${numero}`);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export const createFamily = async (numero, familyData) => {
  try {
    const response = await API.post(`/antecedents/family/${numero}`, familyData);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export const updateFamily = async (numero, familyData) => {
  try {
    const response = await API.put(`/antecedents/family/${numero}`, familyData);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

// ─────────────────────────────────────────────
// Antécédent Gynécologique
// ─────────────────────────────────────────────
export const getGyneco = async (numero) => {
  try {
    const response = await API.get(`/antecedents/gyneco/${numero}`);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export const createGyneco = async (numero, gynecoData) => {
  try {
    const response = await API.post(`/antecedents/gyneco/${numero}`, gynecoData);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export const updateGyneco = async (numero, gynecoData) => {
  try {
    const response = await API.put(`/antecedents/gyneco/${numero}`, gynecoData);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

// ─────────────────────────────────────────────
// Habitudes de Vie
// ─────────────────────────────────────────────
export const getHabitudesVie = async (numero) => {
  try {
    const response = await API.get(`/antecedents/habitudes-vie/${numero}`);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export const createHabitudesVie = async (numero, habitudesVieData) => {
  try {
    const response = await API.post(`/antecedents/habitudes-vie/${numero}`, habitudesVieData);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export const updateHabitudesVie = async (numero, habitudesVieData) => {
  try {
    const response = await API.put(`/antecedents/habitudes-vie/${numero}`, habitudesVieData);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

// ─────────────────────────────────────────────
// Antécédent Médical
// ─────────────────────────────────────────────
export const getMedical = async (numero) => {
  try {
    const response = await API.get(`/antecedents/medical/${numero}`);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export const createMedical = async (numero, medicalData) => {
  try {
    const response = await API.post(`/antecedents/medical/${numero}`, medicalData);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export const updateMedical = async (numero, medicalData) => {
  try {
    const response = await API.put(`/antecedents/medical/${numero}`, medicalData);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

// ─────────────────────────────────────────────
// Antécédent Chirurgical
// ─────────────────────────────────────────────
export const getSurgical = async (numero) => {
  try {
    const response = await API.get(`/antecedents/surgical/${numero}`);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export const createSurgical = async (numero, surgicalData) => {
  try {
    const response = await API.post(`/antecedents/surgical/${numero}`, surgicalData);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export const updateSurgical = async (id, surgicalData) => {
  try {
    const response = await API.put(`/antecedents/surgical/${id}`, surgicalData);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export const deleteSurgical = async (id) => {
  try {
    const response = await API.delete(`/antecedents/surgical/${id}`);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

// ─────────────────────────────────────────────
// Antécédent Thérapeutique
// ─────────────────────────────────────────────
export const getTherapeutic = async (numero) => {
  try {
    const response = await API.get(`/antecedents/therapeutic/${numero}`);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export const createTherapeutic = async (numero, therapeuticData) => {
  try {
    const response = await API.post(`/antecedents/therapeutic/${numero}`, therapeuticData);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export const updateTherapeutic = async (numero, therapeuticData) => {
  try {
    const response = await API.put(`/antecedents/therapeutic/${numero}`, therapeuticData);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

// ─────────────────────────────────────────────
// Antécédent TPE/PrEP
// ─────────────────────────────────────────────
export const getTpePrep = async (numero) => {
  try {
    const response = await API.get(`/antecedents/tpe-prep/${numero}`);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export const createTpePrep = async (numero, tpePrepData) => {
  try {
    const response = await API.post(`/antecedents/tpe-prep/${numero}`, tpePrepData);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export const updateTpePrep = async (id, tpePrepData) => {
  try {
    const response = await API.put(`/antecedents/tpe-prep/${id}`, tpePrepData);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export const deleteTpePrep = async (id) => {
  try {
    const response = await API.delete(`/antecedents/tpe-prep/${id}`);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

// ─────────────────────────────────────────────
// Antécédent Transfusion
// ─────────────────────────────────────────────
export const getTransfusion = async (numero) => {
  try {
    const response = await API.get(`/antecedents/transfusion/${numero}`);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export const createTransfusion = async (numero, transfusionData) => {
  try {
    const response = await API.post(`/antecedents/transfusion/${numero}`, transfusionData);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export const updateTransfusion = async (id, transfusionData) => {
  try {
    const response = await API.put(`/antecedents/transfusion/${id}`, transfusionData);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export const deleteTransfusion = async (id) => {
  try {
    const response = await API.delete(`/antecedents/transfusion/${id}`);
    return response.data;
  } catch (error) {
    throwServiceError(error);
  }
};

export default {
  getFamily,
  createFamily,
  updateFamily,

  getGyneco,
  createGyneco,
  updateGyneco,

  getHabitudesVie,
  createHabitudesVie,
  updateHabitudesVie,

  getMedical,
  createMedical,
  updateMedical,

  getSurgical,
  createSurgical,
  updateSurgical,
  deleteSurgical,

  getTherapeutic,
  createTherapeutic,
  updateTherapeutic,

  getTpePrep,
  createTpePrep,
  updateTpePrep,
  deleteTpePrep,

  getTransfusion,
  createTransfusion,
  updateTransfusion,
  deleteTransfusion,
};