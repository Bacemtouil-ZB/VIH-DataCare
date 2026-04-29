//cheked 15/04/2026
import { TRANSFUSION_INITIAL_STATE } from "./transfusionConstants";

const formatDate = (val) => {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

export const formatTransfusionFromApi = (data) => {
  if (!data) return TRANSFUSION_INITIAL_STATE;
  return {
    date_transfusion: formatDate(data.date_transfusion),
    remarque: data.remarque ?? "",
  };
};

export const formatTransfusionForApi = (form) => ({
  date_transfusion: form.date_transfusion || null,
  remarque: form.remarque || null,
});