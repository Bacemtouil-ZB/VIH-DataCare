// ── Signes Fonctionnels ───────────────────────────────────────────────────────
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

// ── Habitudes de vie ──────────────────────────────────────────────────────────
export const HABITUDES_CHAMPS = [
  { key: "tabagisme",         label: "Tabagisme"         },
  { key: "alcoolemie",        label: "Alcoolémie"        },
  { key: "toxicomanie",       label: "Toxicomanie"       },
  { key: "activite_physique", label: "Activité physique" },
];

export const HABITUDES_INIT = {
  tabagisme: false, alcoolemie: false, toxicomanie: false, activite_physique: false,
};

// ── Signes Cliniques — calcul IMC ─────────────────────────────────────────────
export const calcIMC = (t, p) => {
  const v = p / Math.pow(t / 100, 2);
  if (v < 18.5) return { val: v.toFixed(1), label: "Insuffisance pondérale", color: "#0891b2" };
  if (v < 25)   return { val: v.toFixed(1), label: "Poids normal",           color: "#16a34a" };
  if (v < 30)   return { val: v.toFixed(1), label: "Surpoids",               color: "#d97706" };
  return           { val: v.toFixed(1), label: "Obésité",                    color: "#dc2626" };
};

// ── États initiaux groupés ────────────────────────────────────────────────────
export const UI_INIT   = { loading: true, saving: false, showForm: false, showHistory: true };
export const FORM_SF_INIT = {
  signesId: null, isModifying: false, rasChecked: false,
  signes: { ...SIGNES_INIT }, autresSignes: [], appareilSel: "", description: "",
};
export const FORM_SC_INIT = {
  signeId: null, isModifying: false,
  taille: "", poids: "", autresSignes: [], appareilSel: "", description: "",
};
export const FORM_OBS_INIT = {
  observationId: null, isModifying: false, remarque: "",
};