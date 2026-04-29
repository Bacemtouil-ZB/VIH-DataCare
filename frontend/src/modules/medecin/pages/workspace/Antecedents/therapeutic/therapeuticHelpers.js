//cheked 15/04/2026
import { THERAPEUTIC_INITIAL_STATE } from "./therapeuticConstants";

export const formatTherapeuticFromApi = (data) => {
  if (!data) return THERAPEUTIC_INITIAL_STATE;
  return {
    medicaments_chroniques: data.medicaments_chroniques ?? "",
    allergies_medicaments:  data.allergies_medicaments  ?? "",
    remarque:               data.remarque               ?? "",
  };
};

export const formatTherapeuticForApi = (form) => ({
  medicaments_chroniques: form.medicaments_chroniques || null,
  allergies_medicaments:  form.allergies_medicaments  || null,
  remarque:               form.remarque               || null,
});