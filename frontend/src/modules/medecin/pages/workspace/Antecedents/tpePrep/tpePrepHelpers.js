//cheked 15/04/2026
import { TPE_PREP_INITIAL_STATE } from "./tpePrepConstants";

const formatDate = (val) => {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

export const formatTpePrepFromApi = (data) => {
  if (!data) return TPE_PREP_INITIAL_STATE;
  return {
    tpe_nom_traitement: data.tpe_nom_traitement ?? "",
    tpe_date: formatDate(data.tpe_date),
    prep_nom_traitement: data.prep_nom_traitement ?? "",
    prep_date: formatDate(data.prep_date),
    remarque: data.remarque ?? "",
  };
};

export const formatTpePrepForApi = (form) => ({
  tpe_nom_traitement: form.tpe_nom_traitement || null,
  tpe_date: form.tpe_date || null,
  prep_nom_traitement: form.prep_nom_traitement || null,
  prep_date: form.prep_date || null,
  remarque: form.remarque || null,
});