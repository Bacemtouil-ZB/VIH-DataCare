// import API from "../../../shared/utils/api";

// /**
//  * =========================
//  * ANTECEDENTS (ACTIVE HEADER + VERSIONING)
//  * =========================
//  */

// // Récupérer l'antecedent actif (header: version/status/ids)
// export const getActiveAntecedent = async (numero) => {
//   try {
//     const response = await API.get(`/patients/${numero}/antecedents/active`);
//     return response.data; // { patient, antecedent } (ou antecedent null)
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// // Créer une nouvelle version (archive l'actif + crée un nouveau actif vide)
// export const createAntecedentVersion = async (numero) => {
//   try {
//     const response = await API.post(`/patients/${numero}/antecedents/version`);
//     return response.data; // { patient, antecedent }
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// /**
//  * =========================
//  * 1-1 SECTIONS (GET + PUT UPSERT)
//  * =========================
//  */

// // MEDICAL
// export const getMedical = async (numero) => {
//   try {
//     const response = await API.get(`/patients/${numero}/antecedents/active/medical`);
//     return response.data; // { patient, antecedent, medical }
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// export const updateMedical = async (numero, medicalData) => {
//   try {
//     const response = await API.put(`/patients/${numero}/antecedents/active/medical`, medicalData);
//     return response.data; // { patient, antecedent, medical }
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// // INFECTIOUS
// export const getInfectious = async (numero) => {
//   try {
//     const response = await API.get(`/patients/${numero}/antecedents/active/infectious`);
//     return response.data; // { patient, antecedent, infectious }
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// export const updateInfectious = async (numero, infectiousData) => {
//   try {
//     const response = await API.put(
//       `/patients/${numero}/antecedents/active/infectious`,
//       infectiousData,
//     );
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// // THERAPEUTIC
// export const getTherapeutic = async (numero) => {
//   try {
//     const response = await API.get(`/patients/${numero}/antecedents/active/therapeutic`);
//     return response.data; // { patient, antecedent, therapeutic }
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// export const updateTherapeutic = async (numero, therapeuticData) => {
//   try {
//     const response = await API.put(
//       `/patients/${numero}/antecedents/active/therapeutic`,
//       therapeuticData,
//     );
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// // FAMILY
// export const getFamily = async (numero) => {
//   try {
//     const response = await API.get(`/patients/${numero}/antecedents/active/family`);
//     return response.data; // { patient, antecedent, family }
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// export const updateFamily = async (numero, familyData) => {
//   try {
//     const response = await API.put(`/patients/${numero}/antecedents/active/family`, familyData);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// // GYNECO
// export const getGyneco = async (numero) => {
//   try {
//     const response = await API.get(`/patients/${numero}/antecedents/active/gyneco`);
//     return response.data; // { patient, antecedent, gyneco }
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// export const updateGyneco = async (numero, gynecoData) => {
//   try {
//     const response = await API.put(`/patients/${numero}/antecedents/active/gyneco`, gynecoData);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// /**
//  * =========================
//  * 1-N SECTIONS (GET + PUT REPLACE LIST)
//  * body = tableau
//  * =========================
//  */

// // SURGICAL
// export const getSurgical = async (numero) => {
//   try {
//     const response = await API.get(`/patients/${numero}/antecedents/active/surgical`);
//     return response.data; // { patient, antecedent, surgical: [] }
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// export const replaceSurgical = async (numero, surgicalRows) => {
//   try {
//     // surgicalRows doit être un tableau: [{description, date_intervention}, ...]
//     const response = await API.put(`/patients/${numero}/antecedents/active/surgical`, surgicalRows);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// // TRANSFUSION
// export const getTransfusion = async (numero) => {
//   try {
//     const response = await API.get(`/patients/${numero}/antecedents/active/transfusion`);
//     return response.data; // { patient, antecedent, transfusion: [] }
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// export const replaceTransfusion = async (numero, transfusionRows) => {
//   try {
//     // transfusionRows: [{date_transfusion}, ...]
//     const response = await API.put(
//       `/patients/${numero}/antecedents/active/transfusion`,
//       transfusionRows,
//     );
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// // AES
// export const getAes = async (numero) => {
//   try {
//     const response = await API.get(`/patients/${numero}/antecedents/active/aes`);
//     return response.data; // { patient, antecedent, aes: [] }
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// export const replaceAes = async (numero, aesRows) => {
//   try {
//     // aesRows: [{date_aes}, ...]
//     const response = await API.put(`/patients/${numero}/antecedents/active/aes`, aesRows);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// /**
//  * Export par défaut (comme ton exemple patient)
//  */
// export default {
//   // header + version
//   getActiveAntecedent,
//   createAntecedentVersion,

//   // 1-1
//   getMedical,
//   updateMedical,
//   getInfectious,
//   updateInfectious,
//   getTherapeutic,
//   updateTherapeutic,
//   getFamily,
//   updateFamily,
//   getGyneco,
//   updateGyneco,

//   // 1-N
//   getSurgical,
//   replaceSurgical,
//   getTransfusion,
//   replaceTransfusion,
//   getAes,
//   replaceAes,
// };

import API from "../../../shared/utils/api";

// Backend: app.use("/api/antecedents", antecedentRoutes);
// Donc côté frontend (si baseURL = "/api") => "/antecedents/..."
const BASE = "/antecedents";

// Header
export const getActiveAntecedent = async (numero) => {
  try {
    const res = await API.get(`${BASE}/${numero}/active`);
    console.log("getActiveAntecedent response:", res.data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createAntecedentVersion = async (numero) => {
  try {
    const res = await API.post(`${BASE}/${numero}/version`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 1-1
export const getMedical = async (numero) => {
  try {
    const res = await API.get(`${BASE}/${numero}/active/medical`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const updateMedical = async (numero, data) => {
  try {
    const res = await API.put(`${BASE}/${numero}/active/medical`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getInfectious = async (numero) => {
  try {
    const res = await API.get(`${BASE}/${numero}/active/infectious`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const updateInfectious = async (numero, data) => {
  try {
    const res = await API.put(`${BASE}/${numero}/active/infectious`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getTherapeutic = async (numero) => {
  try {
    const res = await API.get(`${BASE}/${numero}/active/therapeutic`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const updateTherapeutic = async (numero, data) => {
  try {
    const res = await API.put(`${BASE}/${numero}/active/therapeutic`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getFamily = async (numero) => {
  try {
    const res = await API.get(`${BASE}/${numero}/active/family`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const updateFamily = async (numero, data) => {
  try {
    const res = await API.put(`${BASE}/${numero}/active/family`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getGyneco = async (numero) => {
  try {
    const res = await API.get(`${BASE}/${numero}/active/gyneco`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const updateGyneco = async (numero, data) => {
  try {
    const res = await API.put(`${BASE}/${numero}/active/gyneco`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 1-N replace list (body = array)
export const getSurgical = async (numero) => {
  try {
    const res = await API.get(`${BASE}/${numero}/active/surgical`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const replaceSurgical = async (numero, rows) => {
  try {
    const res = await API.put(`${BASE}/${numero}/active/surgical`, rows);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getTransfusion = async (numero) => {
  try {
    const res = await API.get(`${BASE}/${numero}/active/transfusion`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const replaceTransfusion = async (numero, rows) => {
  try {
    const res = await API.put(`${BASE}/${numero}/active/transfusion`, rows);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAes = async (numero) => {
  try {
    const res = await API.get(`${BASE}/${numero}/active/aes`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const replaceAes = async (numero, rows) => {
  try {
    const res = await API.put(`${BASE}/${numero}/active/aes`, rows);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
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