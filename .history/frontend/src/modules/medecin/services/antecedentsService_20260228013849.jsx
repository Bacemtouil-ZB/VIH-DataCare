// import API from "../../../shared/utils/api";

// /**
//  * =========================
//  * ANTECEDENTS (ACTIVE HEADER + VERSIONING)
//  * =========================
//  */

// // Récupérer l'antecedent actif
// export const getActiveAntecedent = async (numero) => {
//   try {
//     const response = await API.get(`/antecedents/${numero}/active`);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// // Créer une nouvelle version
// export const createAntecedentVersion = async (numero) => {
//   try {
//     const response = await API.post(`/antecedents/${numero}/version`);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// /**
//  * =========================
//  * 1-1 SECTIONS
//  * =========================
//  */

// // MEDICAL
// export const getMedical = async (numero) => {
//   const response = await API.get(`/antecedents/${numero}/active/medical`);
//   return response.data;
// };

// export const updateMedical = async (numero, medicalData) => {
//   const response = await API.put(
//     `/antecedents/${numero}/active/medical`,
//     medicalData
//   );
//   return response.data;
// };

// // INFECTIOUS
// export const getInfectious = async (numero) => {
//   const response = await API.get(`/antecedents/${numero}/active/infectious`);
//   return response.data;
// };

// export const updateInfectious = async (numero, infectiousData) => {
//   const response = await API.put(
//     `/antecedents/${numero}/active/infectious`,
//     infectiousData
//   );
//   return response.data;
// };

// // THERAPEUTIC
// export const getTherapeutic = async (numero) => {
//   const response = await API.get(`/antecedents/${numero}/active/therapeutic`);
//   return response.data;
// };

// export const updateTherapeutic = async (numero, therapeuticData) => {
//   const response = await API.put(
//     `/antecedents/${numero}/active/therapeutic`,
//     therapeuticData
//   );
//   return response.data;
// };

// // FAMILY
// export const getFamily = async (numero) => {
//   const response = await API.get(`/antecedents/${numero}/active/family`);
//   return response.data;
// };

// export const updateFamily = async (numero, familyData) => {
//   const response = await API.put(
//     `/antecedents/${numero}/active/family`,
//     familyData
//   );
//   return response.data;
// };

// // GYNECO
// export const getGyneco = async (numero) => {
//   const response = await API.get(`/antecedents/${numero}/active/gyneco`);
//   return response.data;
// };

// export const updateGyneco = async (numero, gynecoData) => {
//   const response = await API.put(
//     `/antecedents/${numero}/active/gyneco`,
//     gynecoData
//   );
//   console.log("updateGyneco response:", response.data);
//   return response.data;
// };

// /**
//  * =========================
//  * 1-N SECTIONS
//  * =========================
//  */

// // SURGICAL
// export const getSurgical = async (numero) => {
//   const response = await API.get(`/antecedents/${numero}/active/surgical`);
//   return response.data;
// };

// export const replaceSurgical = async (numero, surgicalRows) => {
//   const response = await API.put(
//     `/antecedents/${numero}/active/surgical`,
//     surgicalRows
//   );
//   return response.data;
// };

// // TRANSFUSION
// export const getTransfusion = async (numero) => {
//   const response = await API.get(`/antecedents/${numero}/active/transfusion`);
//   return response.data;
// };

// export const replaceTransfusion = async (numero, transfusionRows) => {
//   const response = await API.put(
//     `/antecedents/${numero}/active/transfusion`,
//     transfusionRows
//   );
//   return response.data;
// };

// // AES
// export const getAes = async (numero) => {
//   const response = await API.get(`/antecedents/${numero}/active/aes`);
//   return response.data;
// };

// export const replaceAes = async (numero, aesRows) => {
//   const response = await API.put(
//     `/antecedents/${numero}/active/aes`,
//     aesRows
//   );
//   return response.data;
// };

// export default {
//   getActiveAntecedent,
//   createAntecedentVersion,

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

//   getSurgical,
//   replaceSurgical,
//   getTransfusion,
//   replaceTransfusion,
//   getAes,
//   replaceAes,
// };

import API from "../../../shared/utils/api";

/**
 * Service Antecedents (stable)
 * Fix principal: NE PAS envoyer id / antecedent_id (sinon backend upsertOneToOne génère:
 * "la colonne antecedent_id est spécifiée plus d'une fois")
 * + Erreurs détaillées + "" -> null + gyneco int/constraint
 */

const BASE = "/antecedents";

// ---------- error handling ----------
const buildApiError = (error, { method, url, payload } = {}) => {
  const status = error?.response?.status ?? null;
  const data = error?.response?.data ?? null;

  // backend sometimes returns HTML (Express error page)
  const rawMessage =
    (typeof data === "string" ? data : null) ||
    data?.message ||
    data?.error ||
    error?.message ||
    "Unknown error";

  const message =
    typeof rawMessage === "string"
      ? rawMessage.replace(/<[^>]*>/g, "").trim() // strip html tags if any
      : "Unknown error";

  const err = new Error(message || "Unknown error");
  err.details = {
    message: message || "Unknown error",
    status,
    method: method ?? null,
    url: url ?? null,
    payload: payload ?? null,
    response: data ?? null,
  };
  return err;
};

const request = async (method, url, payload) => {
  try {
    const res =
      method === "get"
        ? await API.get(url)
        : method === "post"
          ? await API.post(url, payload)
          : method === "put"
            ? await API.put(url, payload)
            : (() => {
                throw new Error(`Unsupported method: ${method}`);
              })();

    return res.data;
  } catch (error) {
    const apiErr = buildApiError(error, { method: method.toUpperCase(), url, payload });
    // log complet
    console.error("[API ERROR]", apiErr.details);
    throw apiErr;
  }
};

// ---------- sanitizers ----------
const emptyToNull = (v) => (v === "" || v === undefined ? null : v);

const toIntOrNull = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const extractSection = (sectionKey, data) => {
  if (!data) return {};
  if (data?.[sectionKey] && typeof data[sectionKey] === "object") return data[sectionKey];
  return data; // assume already section object
};

const stripServerKeys = (obj) => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return {};
  // remove keys that MUST NOT be sent to 1-1 upsert endpoints
  // (id, antecedent_id cause SQL duplicate column)
  const {
    id,
    updated_at,
    createdAt,
    updatedAt,
    antecedent_id,
    ...rest
  } = obj;
  return rest;
};

const sanitizeOneToOnePayload = (sectionKey, data) => {
  const sectionObj = extractSection(sectionKey, data);
  const cleaned = stripServerKeys(sectionObj);

  const out = {};
  for (const [k, v] of Object.entries(cleaned)) {
    out[k] = emptyToNull(v);
  }
  return out;
};

// ---------- Header / Version ----------
export const getActiveAntecedent = (numero) => request("get", `${BASE}/${numero}/active`);

export const createAntecedentVersion = (numero) => request("post", `${BASE}/${numero}/version`, {});

// ---------- 1-1 sections ----------
export const getMedical = (numero) => request("get", `${BASE}/${numero}/active/medical`);
export const updateMedical = (numero, medicalData) => {
  const payload = sanitizeOneToOnePayload("medical", medicalData);
  return request("put", `${BASE}/${numero}/active/medical`, payload);
};

export const getInfectious = (numero) => request("get", `${BASE}/${numero}/active/infectious`);
export const updateInfectious = (numero, infectiousData) => {
  const payload = sanitizeOneToOnePayload("infectious", infectiousData);
  return request("put", `${BASE}/${numero}/active/infectious`, payload);
};

export const getTherapeutic = (numero) => request("get", `${BASE}/${numero}/active/therapeutic`);
export const updateTherapeutic = (numero, therapeuticData) => {
  const payload = sanitizeOneToOnePayload("therapeutic", therapeuticData);
  return request("put", `${BASE}/${numero}/active/therapeutic`, payload);
};

export const getFamily = (numero) => request("get", `${BASE}/${numero}/active/family`);
export const updateFamily = (numero, familyData) => {
  const payload = sanitizeOneToOnePayload("family", familyData);
  return request("put", `${BASE}/${numero}/active/family`, payload);
};

// GYNECO (1-1 + integers + constraint) - also strip id/antecedent_id if present
export const getGyneco = (numero) => request("get", `${BASE}/${numero}/active/gyneco`);

export const updateGyneco = (numero, gynecoData) => {
  const g0 = extractSection("gyneco", gynecoData);
  const g = stripServerKeys(g0);

  const payload = {
    gestite: toIntOrNull(g?.gestite),
    parite: toIntOrNull(g?.parite),
    avortement: toIntOrNull(g?.avortement),
    complications: emptyToNull(g?.complications),
    suivi_gynecologique: emptyToNull(g?.suivi_gynecologique),
    depistage_cancer_col: emptyToNull(g?.depistage_cancer_col),
  };

  if (payload.gestite !== null) {
    const total = (payload.parite ?? 0) + (payload.avortement ?? 0);
    if (total > payload.gestite) {
      const err = new Error("Parité + avortement doit être ≤ gestité.");
      err.details = { message: err.message, section: "gyneco", payload };
      throw err;
    }
  }

  return request("put", `${BASE}/${numero}/active/gyneco`, payload);
};

// ---------- 1-N sections (inchangé) ----------
export const getSurgical = (numero) => request("get", `${BASE}/${numero}/active/surgical`);
export const replaceSurgical = (numero, surgicalRows) => {
  const payload = Array.isArray(surgicalRows) ? surgicalRows : [];
  return request("put", `${BASE}/${numero}/active/surgical`, payload);
};

export const getTransfusion = (numero) => request("get", `${BASE}/${numero}/active/transfusion`);
export const replaceTransfusion = (numero, transfusionRows) => {
  const payload = Array.isArray(transfusionRows) ? transfusionRows : [];
  return request("put", `${BASE}/${numero}/active/transfusion`, payload);
};

export const getAes = (numero) => request("get", `${BASE}/${numero}/active/aes`);
export const replaceAes = (numero, aesRows) => {
  const payload = Array.isArray(aesRows) ? aesRows : [];
  return request("put", `${BASE}/${numero}/active/aes`, payload);
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