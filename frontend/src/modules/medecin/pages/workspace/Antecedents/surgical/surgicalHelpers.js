//cheked 15/04/2026
import { SURGICAL_INITIAL_STATE } from "./surgicalConstants";

const formatDate = (val) => {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

export const formatSurgicalFromApi = (data) => {
  if (!data) return SURGICAL_INITIAL_STATE;
  return {
    description: data.description ?? "",
    date_intervention: formatDate(data.date_intervention),
    remarque: data.remarque ?? "",
  };
};

export const formatSurgicalForApi = (form) => ({
  description: form.description || null,
  date_intervention: form.date_intervention || null,
  remarque: form.remarque || null,
});