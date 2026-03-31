import { MEDICAL_INITIAL_STATE } from "./medicalConstants";

export const formatMedicalFromApi = (data) => {
  if (!data) return MEDICAL_INITIAL_STATE;
  return {
    diabete: data.diabete ?? false,
    hypertension: data.hypertension ?? false,
    cardiopathies: data.cardiopathies ?? false,
    insuffisance_renale: data.insuffisance_renale ?? false,
    maladies_hepatiques: data.maladies_hepatiques ?? false,
    asthme_bpco: data.asthme_bpco ?? false,
    cancers: data.cancers ?? false,
    autres: data.autres ?? "",
    remarque: data.remarque ?? "",
  };
};

export const formatMedicalForApi = (form) => ({
  diabete: form.diabete,
  hypertension: form.hypertension,
  cardiopathies: form.cardiopathies,
  insuffisance_renale: form.insuffisance_renale,
  maladies_hepatiques: form.maladies_hepatiques,
  asthme_bpco: form.asthme_bpco,
  cancers: form.cancers,
  autres: form.autres || null,
  remarque: form.remarque || null,
});