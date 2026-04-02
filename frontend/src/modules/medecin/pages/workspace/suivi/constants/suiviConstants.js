// ============================================================
//  suiviConstants.js
//  Source de vérité unique pour toutes les valeurs fixes
//  du dashboard Suivi & Surveillance VIH
// ============================================================


// ── Seuils médicaux ──────────────────────────────────────────────────────────

export const SEUILS_CD4 = {
  CRITIQUE:  200,   // CD4 < 200  → danger immunitaire
  MOYEN_MIN: 200,   // CD4 200-500 → surveillance
  MOYEN_MAX: 500,   // CD4 > 500  → objectif thérapeutique
};

export const SEUILS_CV = {
  DETECTABLE:   1000, // CV > 1000  → virus actif, échec traitement
  INDETECTABLE:  200, // CV < 200   → succès thérapeutique
};

export const SEUILS_HGB = {
  CRITIQUE: 10,  // HGB < 10 g/dL → anémie sévère
  NORMAL:   12,  // HGB > 12 g/dL → normal
};


// ── Statuts ──────────────────────────────────────────────────────────────────

export const STATUTS = {
  BON:      "Bon",
  MOYEN:    "Moyen",
  CRITIQUE: "Critique",
  INCONNU:  "Inconnu",
};

// Couleurs Ant Design par statut (utilisées dans <Tag color={...}>)
export const COULEURS_STATUT = {
  [STATUTS.BON]:      "success",
  [STATUTS.MOYEN]:    "warning",
  [STATUTS.CRITIQUE]: "error",
  [STATUTS.INCONNU]:  "default",
};

// Couleurs hex par statut (utilisées dans Recharts et styles inline)
export const COULEURS_STATUT_HEX = {
  [STATUTS.BON]:      "#639922",
  [STATUTS.MOYEN]:    "#BA7517",
  [STATUTS.CRITIQUE]: "#E24B4A",
  [STATUTS.INCONNU]:  "#888780",
};


// ── Couleurs ARV (zones colorées sur graphiques Recharts) ────────────────────
// Ordre = ordre d'apparition des traitements dans le temps
// Opacité gérée dans le composant via fillOpacity

export const COULEURS_ARV = [
  { fill: "#B5D4F4", stroke: "#378ADD" }, // bleu   → traitement 1
  { fill: "#9FE1CB", stroke: "#1D9E75" }, // vert   → traitement 2
  { fill: "#FAC775", stroke: "#BA7517" }, // amber  → traitement 3
  { fill: "#F4C0D1", stroke: "#D4537E" }, // rose   → traitement 4
  { fill: "#CEC BF6", stroke: "#7F77DD" }, // violet → traitement 5
];


// ── Lignes de référence sur graphiques ───────────────────────────────────────

export const LIGNES_REF_CD4 = [
  {
    valeur:  SEUILS_CD4.CRITIQUE,
    couleur: "#E24B4A",
    label:   "Critique (200)",
    dash:    "4 4",
  },
  {
    valeur:  SEUILS_CD4.MOYEN_MAX,
    couleur: "#639922",
    label:   "Objectif (500)",
    dash:    "4 4",
  },
];

export const LIGNES_REF_CV = [
  {
    valeur:  SEUILS_CV.DETECTABLE,
    couleur: "#E24B4A",
    label:   "Détectable (1 000)",
    dash:    "4 4",
  },
];


// ── Configuration graphiques Recharts ────────────────────────────────────────

export const CONFIG_GRAPHIQUE = {
  hauteur:          300,
  couleur_cd4:      "#378ADD",  // bleu  → courbe CD4
  couleur_cv:       "#E24B4A",  // rouge → courbe CV
  couleur_grille:   "#e8e8e8",
  epaisseur_courbe: 2,
  rayon_point:      5,
  rayon_point_hover: 7,
};


// ── Types de bilan ───────────────────────────────────────────────────────────

export const TYPES_BILAN = {
  INITIAL: "Initial",
  SUIVI:   "Suivi",
};

export const COULEURS_TYPE_BILAN = {
  [TYPES_BILAN.INITIAL]: "blue",
  [TYPES_BILAN.SUIVI]:   "green",
};


// ── Unités médicales ─────────────────────────────────────────────────────────

export const UNITES = {
  CD4:         "cell/mm³",
  CV:          "copies/mL",
  HGB:         "g/dL",
  PLAQUETTES:  "10³/mm³",
  LYMPHOCYTES: "10³/mm³",
};


// ── Messages vides ───────────────────────────────────────────────────────────

export const MESSAGES_VIDES = {
  kpis:      "Aucune donnée disponible pour ce patient",
  graphique: "Aucune mesure enregistrée",
  tableau:   "Aucun bilan enregistré pour ce patient",
};