//cheked 15/04/2026
export const MEDICAL_INITIAL_STATE = {
  diabete: false,
  hypertension: false,
  cardiopathies: false,
  insuffisance_renale: false,
  maladies_hepatiques: false,
  asthme_bpco: false,
  cancers: false,
  autres: "",
  remarque: "",
};

export const MEDICAL_FIELDS = [
  { key: "diabete", label: "Diabète" },
  { key: "hypertension", label: "Hypertension" },
  { key: "cardiopathies", label: "Cardiopathies" },
  { key: "insuffisance_renale", label: "Insuffisance Rénale" },
  { key: "maladies_hepatiques", label: "Maladies Hépatiques" },
  { key: "asthme_bpco", label: "Asthme / BPCO" },
  { key: "cancers", label: "Cancers" },
];