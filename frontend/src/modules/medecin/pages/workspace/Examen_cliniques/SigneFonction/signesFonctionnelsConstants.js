//cheked 15/04/2026
export const PAGE_CONTAINER_CLASS = "ec-page-bg";
export const HISTORY_HEADERS = ["Date", "Signes positifs", "Action"];
export const SIGNES_KEYS = [
  "fievre","toux","dyspnee","sueurs_nocturnes","cephalee","rhinorrhee",
  "troubles_visuels","diarrhee","douleurs_abdomen","anorexie","nausees",
  "insomnie","dysphagie","prurit","paresthesie","myalgie","arthralgie",
  "crampes","troubles_humeur","troubles_libido","asthenie",
];

export const SIGNES_LABELS = {
  fievre:"Fièvre", toux:"Toux", dyspnee:"Dyspnée", sueurs_nocturnes:"Sueurs nocturnes",
  cephalee:"Céphalée", rhinorrhee:"Rhinorrhée", troubles_visuels:"Troubles visuels",
  diarrhee:"Diarrhée", douleurs_abdomen:"Douleurs abdomen", anorexie:"Anorexie",
  nausees:"Nausées", insomnie:"Insomnie", dysphagie:"Dysphagie", prurit:"Prurit",
  paresthesie:"Paresthésie", myalgie:"Myalgie", arthralgie:"Arthralgie",
  crampes:"Crampes", troubles_humeur:"Troubles humeur", troubles_libido:"Troubles libido",
  asthenie:"Asthénie",
};

export const SIGNES_INIT = Object.fromEntries(SIGNES_KEYS.map((k) => [k, false]));
export const getSignesPositifs = (sd) => SIGNES_KEYS.filter((k) => sd?.[k] === true).map((k) => SIGNES_LABELS[k]);

export const FORM_SF_INIT = {
  signesId: null, isModifying: false, rasChecked: false,
  signes: { ...SIGNES_INIT }, autresSignes: [], appareilSel: "", description: "",
};