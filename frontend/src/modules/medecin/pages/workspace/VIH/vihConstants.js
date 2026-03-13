export const PAGE_TITLE = "Fiche VIH du patient";

export const FORM_INIT = {
  mode_contamination: [],
  type_depistage: "",
  circonstance_decouverte: "",
  date_derniere_negative: "",
  date_contamination: "",
  date_vih_positif: "",
  stade_cdc: "",
  debut_stade_c: "",
  typage_hla_b5701: "",
  profil_seroconversion: null,
};

export const MODES_CONTAMINATION = [
  "A.E.S",
  "Homosexuel",
  "Bisexuel",
  "Hémophile",
  "Hétérosexuel",
  "Mère/Nouveau-né",
  "Toxicomanie IV",
  "Transfusion",
  "Hémophilie",
  "Inconnu",
  "Autre",
];

export const TYPES_DEPISTAGE = [
  "Trod",
  "Elisa",
  "Autres",
];

export const CIRCONSTANCES_DECOUVERTE = [
  "Proposition d'une association",
  "Proposition à l'initiative du patient",
  "Proposition du médecin",
  "Demande du patient",
  "Autres circonstances",
];

export const STADES_CDC = [
  "A0", "A1", "A2", "A3",
  "B0", "B1", "B2", "B3",
  "C0", "C1", "C2", "C3",
];

export const TYPAGE_HLA_OPTIONS = [
  "Positif",
  "Négatif",
];

export const PROFIL_SEROCONVERSION_OPTIONS = [
  { label: "Oui", value: true },
  { label: "Non", value: false },
];

export const REQUIRED_FIELDS = [
  { key: "mode_contamination", label: "Le mode de contamination" },
  { key: "type_depistage", label: "Le type de dépistage" },
  { key: "circonstance_decouverte", label: "La circonstance de découverte" },
  { key: "date_vih_positif", label: "La date du test VIH positif" },
  { key: "stade_cdc", label: "Le stade CDC" },
  { key: "typage_hla_b5701", label: "Le typage HLA-B5701" },
];
