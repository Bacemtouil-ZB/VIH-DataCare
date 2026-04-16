//cheked 15/04/2026
import { HABITUDES_VIE_INITIAL_STATE } from "./habitudesVieConstants";

// Converts any date value from API to YYYY-MM-DD string for input[type=date]
const formatDate = (val) => {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

export const formatHabitudesVieFromApi = (data) => {
  if (!data) return HABITUDES_VIE_INITIAL_STATE;
  const keys = Object.keys(HABITUDES_VIE_INITIAL_STATE);
  const result = {};
  keys.forEach((key) => {
    const val = data[key];
    if (typeof HABITUDES_VIE_INITIAL_STATE[key] === "boolean") {
      result[key] = val ?? false;
    } else if (key.endsWith("_date")) {
      result[key] = formatDate(val);
    } else {
      result[key] = val ?? "";
    }
  });
  return result;
};

export const formatHabitudesVieForApi = (form) => {
  const result = {};
  Object.keys(form).forEach((key) => {
    const val = form[key];
    if (typeof val === "boolean") {
      result[key] = val;
    } else {
      result[key] = val || null;
    }
  });
  return result;
};