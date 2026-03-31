import { GYNECO_INITIAL_STATE } from "./gynecoConstants";

export const formatGynecoFromApi = (data) => {
  if (!data) return GYNECO_INITIAL_STATE;
  return {
    gestite:              data.gestite              ?? "",
    parite:               data.parite               ?? "",
    avortement:           data.avortement           ?? "",
    complications:        data.complications        ?? "",
    suivi_gynecologique:  data.suivi_gynecologique  ?? "",
    depistage_cancer_col: data.depistage_cancer_col ?? "",
    remarque:             data.remarque             ?? "",
  };
};

export const formatGynecoForApi = (form) => ({
  gestite:              form.gestite              !== "" ? parseInt(form.gestite, 10)    : null,
  parite:               form.parite               !== "" ? parseInt(form.parite, 10)     : null,
  avortement:           form.avortement           !== "" ? parseInt(form.avortement, 10) : null,
  complications:        form.complications        || null,
  suivi_gynecologique:  form.suivi_gynecologique  || null,
  depistage_cancer_col: form.depistage_cancer_col || null,
  remarque:             form.remarque             || null,
});