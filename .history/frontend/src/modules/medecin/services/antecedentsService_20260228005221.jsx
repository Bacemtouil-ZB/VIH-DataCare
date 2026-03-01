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
// export const getGyneco = async (numero) => {
//   const response = await API.get(`/antecedents/${numero}/active/gyneco`);
//   return response.data;
// };

// export const updateGyneco = async (numero, gynecoData) => {
//   const response = await API.put(
//     `/antecedents/${numero}/active/gyneco`,
//     gynecoData
//   );
//   return response.data;
// };
const toIntOrNull = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const cleanTextOrNull = (v) => {
  if (v === "" || v === undefined) return null;
  return v;
};

// -------------------- GYNECO --------------------
export const getGyneco = async (numero) => {
  try {
    const res = await API.get(`/antecedents/${numero}/active/gyneco`);

    // Normalisation (évite valeurs null/ISO)
    const g = res.data?.gyneco ?? res.data?.data ?? res.data ?? {};

    return {
      ...res.data,
      gyneco: {
        ...g,
        gestite: g?.gestite ?? null,
        parite: g?.parite ?? null,
        avortement: g?.avortement ?? null,
        // si tu as des dates dans ce bloc un jour:
        // some_date: toDateInputValue(g?.some_date),
      },
    };
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateGyneco = async (numero, gynecoData) => {
  try {
    // Sanitize numbers + texts (évite 22P02 + 23514)
    const gestite = toIntOrNull(gynecoData?.gestite);
    const parite = toIntOrNull(gynecoData?.parite);
    const avortement = toIntOrNull(gynecoData?.avortement);

    // Validation check constraint: (parite + avortement) <= gestite
    if (gestite !== null) {
      const total = (parite ?? 0) + (avortement ?? 0);
      if (total > gestite) {
        throw new Error("Parité + avortement doit être ≤ gestité.");
      }
    }

    const payload = {
      gestite,
      parite,
      avortement,
      complications: cleanTextOrNull(gynecoData?.complications),
      suivi_gynecologique: cleanTextOrNull(gynecoData?.suivi_gynecologique),
      depistage_cancer_col: cleanTextOrNull(gynecoData?.depistage_cancer_col),
    };

    const res = await API.put(`/antecedents/${numero}/active/gyneco`, payload);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
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