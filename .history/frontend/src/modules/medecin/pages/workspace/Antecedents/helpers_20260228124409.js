// ---------- helpers for Antecedent form (pure functions) ----------

const toDateInputValue = (v) => {
  if (!v) return "";
  if (typeof v !== "string") return "";
  return v.length >= 10 ? v.slice(0, 10) : v;
};

// Backend returns DB rows (with id, antecedent_id, updated_by...). Keep form state "pure".
const stripSystemKeys = (obj) => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;

  const SYSTEM_KEYS = new Set([
    "id",
    "antecedent_id",
    "created_by",
    "updated_by",
    "created_at",
    "updated_at",
    "archived_by",
    "archived_at",
    // joins/envelopes (just in case)
    "patient",
    "antecedent",
  ]);

  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (SYSTEM_KEYS.has(k)) continue;
    out[k] = v;
  }
  return out;
};

export const normalizeFromApi = (sectionId, sectionData) => {
  if (sectionData == null) return null;

  // 1-N lists
  if (sectionId === "surgical") {
    return (Array.isArray(sectionData) ? sectionData : []).map((row) => ({
      description: row?.description ?? null,
      date_intervention: toDateInputValue(row?.date_intervention),
    }));
  }
  if (sectionId === "transfusion") {
    return (Array.isArray(sectionData) ? sectionData : []).map((row) => ({
      date_transfusion: toDateInputValue(row?.date_transfusion),
    }));
  }
  if (sectionId === "aes") {
    return (Array.isArray(sectionData) ? sectionData : []).map((row) => ({
      date_aes: toDateInputValue(row?.date_aes),
    }));
  }

  // 1-1 objects
  return stripSystemKeys(sectionData);
};

export const sanitizeForApi = (sectionId, payload) => {
  // Backend prefers null over "" for nullable columns
  const cleanValue = (v) => (v === "" ? null : v);

  // 1-N must be array
  if (sectionId === "surgical") {
    const arr = Array.isArray(payload) ? payload : [];
    return arr.map((r) => ({
      description: cleanValue(r?.description ?? null),
      date_intervention: cleanValue(r?.date_intervention ?? null),
    }));
  }
  if (sectionId === "transfusion") {
    const arr = Array.isArray(payload) ? payload : [];
    return arr.map((r) => ({
      date_transfusion: cleanValue(r?.date_transfusion ?? null),
    }));
  }
  if (sectionId === "aes") {
    const arr = Array.isArray(payload) ? payload : [];
    return arr.map((r) => ({
      date_aes: cleanValue(r?.date_aes ?? null),
    }));
  }

  // 1-1 objects
  const obj = payload && typeof payload === "object" ? payload : {};
  const out = {};
  for (const [k, v] of Object.entries(obj)) out[k] = cleanValue(v);
  return out;
};

export const getErrorMessage = (e) => {
  if (!e) return "Erreur inconnue";
  if (typeof e === "string") return e;

  const raw =
    e?.message ||
    e?.error ||
    e?.response?.data?.message ||
    e?.response?.data ||
    null;

  if (typeof raw === "string") return raw.replace(/<[^>]*>/g, "").trim();
  return "Erreur inconnue";
};
