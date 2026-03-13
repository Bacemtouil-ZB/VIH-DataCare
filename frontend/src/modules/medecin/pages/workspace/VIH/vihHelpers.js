import { FORM_INIT } from "./vihConstants";

export const getVihValidationError = (formData, requiredFields) => {
  for (const field of requiredFields) {
    const value = formData[field.key];
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return `${field.label} est obligatoire`;
    }
  }
  return null;
};

export const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
};

export const normalizeModesContamination = (mc) => {
  if (Array.isArray(mc)) return mc;
  if (!mc) return [];
  return mc.split(",").map((s) => s.trim()).filter(Boolean);
};

export const serializeModesContamination = (mc) => {
  if (Array.isArray(mc)) return mc.join(", ");
  return mc || "";
};

export const buildFormFromVihData = (vihData) => {
  if (!vihData) return { ...FORM_INIT };
  return {
    mode_contamination: normalizeModesContamination(vihData.mode_contamination),
    type_depistage: vihData.type_depistage || "",
    circonstance_decouverte: vihData.circonstance_decouverte || "",
    date_derniere_negative: formatDate(vihData.date_derniere_negative),
    date_contamination: formatDate(vihData.date_contamination),
    date_vih_positif: formatDate(vihData.date_vih_positif),
    stade_cdc: vihData.stade_cdc || "",
    debut_stade_c: formatDate(vihData.debut_stade_c),
    typage_hla_b5701: vihData.typage_hla_b5701 || "",
    profil_seroconversion: vihData.profil_seroconversion ?? null,
  };
};
