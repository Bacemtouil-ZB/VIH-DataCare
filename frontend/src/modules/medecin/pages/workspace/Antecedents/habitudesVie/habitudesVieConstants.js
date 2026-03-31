export const HABITUDES_VIE_INITIAL_STATE = {
  // Habitudes de base
  tabagisme: false,
  alcoolemie: false,
  activite_physique: false,
  // Compléments alimentaires
  proteines: false,
  proteines_date: "",
  creatine: false,
  creatine_date: "",
  complements_vitaminiques: false,
  complements_vitaminiques_type: "",
  complements_vitaminiques_date: "",
  multivitamines: false,
  multivitamines_type: "",
  multivitamines_date: "",
  plantes_medicinales: false,
  plantes_medicinales_type: "",
  plantes_medicinales_date: "",
  autres_complements: false,
  autres_complements_type: "",
  autres_complements_date: "",
  // Autres consommations
  drogues_injectables: false,
  drogues_injectables_date: "",
  cannabis: false,
  cannabis_date: "",
  cocaine: false,
  cocaine_date: "",
  crack: false,
  crack_date: "",
  heroine: false,
  heroine_date: "",
  ecstasy: false,
  ecstasy_date: "",
  pregabaline: false,
  pregabaline_date: "",
  tramadol: false,
  tramadol_date: "",
  codeine: false,
  codeine_date: "",
  chicha: false,
  cafeine_excessive: false,
};

export const BASE_HABITS = [
  { key: "tabagisme", label: "Tabagisme" },
  { key: "alcoolemie", label: "Alcoolémie" },
  { key: "activite_physique", label: "Activité physique" },
  { key: "chicha", label: "Chicha" },
  { key: "cafeine_excessive", label: "Caféine excessive" },
];

export const COMPLEMENTS = [
  { key: "proteines", label: "Protéines", hasType: false, hasDate: true },
  { key: "creatine", label: "Créatine", hasType: false, hasDate: true },
  { key: "complements_vitaminiques", label: "Compléments vitaminiques", hasType: true, hasDate: true },
  { key: "multivitamines", label: "Multivitamines", hasType: true, hasDate: true },
  { key: "plantes_medicinales", label: "Plantes médicinales", hasType: true, hasDate: true },
  { key: "autres_complements", label: "Autres compléments", hasType: true, hasDate: true },
];

export const DROGUES = [
  { key: "drogues_injectables", label: "Drogues injectables" },
  { key: "cannabis", label: "Cannabis" },
  { key: "cocaine", label: "Cocaïne" },
  { key: "crack", label: "Crack" },
  { key: "heroine", label: "Héroïne" },
  { key: "ecstasy", label: "Ecstasy" },
  { key: "pregabaline", label: "Prégabaline" },
  { key: "tramadol", label: "Tramadol" },
  { key: "codeine", label: "Codéine" },
];