import API from "../../../shared/utils/api";

/**
 * =========================
 * ANTECEDENTS (ACTIVE HEADER + VERSIONING)
 * =========================
 */

// Récupérer l'antecedent actif
export const getActiveAntecedent = async (numero) => {
  try {
    const response = await API.get(`/antecedents/${numero}/active`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Créer une nouvelle version
export const createAntecedentVersion = async (numero) => {
  try {
    const response = await API.post(`/antecedents/${numero}/version`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * =========================
 * 1-1 SECTIONS
 * =========================
 */

// MEDICAL
export const getMedical = async (numero) => {
  const response = await API.get(`/antecedents/${numero}/active/medical`);
  return response.data;
};

export const updateMedical = async (numero, medicalData) => {
  const response = await API.put(
    `/antecedents/${numero}/active/medical`,
    medicalData
  );
  return response.data;
};

// INFECTIOUS
export const getInfectious = async (numero) => {
  const response = await API.get(`/antecedents/${numero}/active/infectious`);
  return response.data;
};

export const updateInfectious = async (numero, infectiousData) => {
  const response = await API.put(
    `/antecedents/${numero}/active/infectious`,
    infectiousData
  );
  return response.data;
};

// THERAPEUTIC
export const getTherapeutic = async (numero) => {
  const response = await API.get(`/antecedents/${numero}/active/therapeutic`);
  return response.data;
};

export const updateTherapeutic = async (numero, therapeuticData) => {
  const response = await API.put(
    `/antecedents/${numero}/active/therapeutic`,
    therapeuticData
  );
  return response.data;
};

// FAMILY
export const getFamily = async (numero) => {
  const response = await API.get(`/antecedents/${numero}/active/family`);
  return response.data;
};

export const updateFamily = async (numero, familyData) => {
  const response = await API.put(
    `/antecedents/${numero}/active/family`,
    familyData
  );
  return response.data;
};

// GYNECO
export const getGyneco = async (numero) => {
  const response = await API.get(`/antecedents/${numero}/active/gyneco`);
  return response.data;
};

export const updateGyneco = async (numero, gynecoData) => {
  const response = await API.put(
    `/antecedents/${numero}/active/gyneco`,
    gynecoData
  );
  console.log("updateGyneco response:", response.data);
  return response.data;
};

/**
 * =========================
 * 1-N SECTIONS
 * =========================
 */

// SURGICAL
export const getSurgical = async (numero) => {
  const response = await API.get(`/antecedents/${numero}/active/surgical`);
  return response.data;
};

export const replaceSurgical = async (numero, surgicalRows) => {
  const response = await API.put(
    `/antecedents/${numero}/active/surgical`,
    surgicalRows
  );
  return response.data;
};

// TRANSFUSION
export const getTransfusion = async (numero) => {
  const response = await API.get(`/antecedents/${numero}/active/transfusion`);
  return response.data;
};

export const replaceTransfusion = async (numero, transfusionRows) => {
  const response = await API.put(
    `/antecedents/${numero}/active/transfusion`,
    transfusionRows
  );
  return response.data;
};

// AES
export const getAes = async (numero) => {
  const response = await API.get(`/antecedents/${numero}/active/aes`);
  return response.data;
};

export const replaceAes = async (numero, aesRows) => {
  const response = await API.put(
    `/antecedents/${numero}/active/aes`,
    aesRows
  );
  return response.data;
};

export default {
  getActiveAntecedent,
  createAntecedentVersion,

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