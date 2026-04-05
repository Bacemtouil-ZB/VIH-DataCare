// ============================================================
//  suiviConstants.js
// ============================================================

// ── Seuils médicaux ──────────────────────────────────────────
export const SEUILS_CD4 = {
  CRITIQUE:  200,
  MOYEN_MIN: 200,
  MOYEN_MAX: 500,
};

export const SEUILS_CV = {
  DETECTABLE:   1000,
  INDETECTABLE:  200,
};

export const SEUILS_CREATININE = {  // ✅ remplace SEUILS_HGB
  CRITIQUE: 120,   // > 120 mmol/L → élevée
  NORMAL:    90,   // < 90  mmol/L → normal
};

// ── Statuts ──────────────────────────────────────────────────
export const STATUTS = {
  BON:      "Bon",
  MOYEN:    "Moyen",
  CRITIQUE: "Critique",
  INCONNU:  "Inconnu",
};

export const COULEURS_STATUT = {
  [STATUTS.BON]:      "success",
  [STATUTS.MOYEN]:    "warning",
  [STATUTS.CRITIQUE]: "error",
  [STATUTS.INCONNU]:  "default",
};

export const COULEURS_STATUT_HEX = {
  [STATUTS.BON]:      "#639922",
  [STATUTS.MOYEN]:    "#BA7517",
  [STATUTS.CRITIQUE]: "#E24B4A",
  [STATUTS.INCONNU]:  "#888780",
};

// ── Couleurs ARV ─────────────────────────────────────────────
export const COULEURS_ARV = [
  { fill: "#B5D4F4", stroke: "#378ADD" },
  { fill: "#9FE1CB", stroke: "#1D9E75" },
  { fill: "#FAC775", stroke: "#BA7517" },
  { fill: "#F4C0D1", stroke: "#D4537E" },
  { fill: "#CECBF6", stroke: "#7F77DD" }, // ✅ espace supprimé
];

// ── Lignes de référence graphiques ───────────────────────────
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

// ── Configuration graphiques ─────────────────────────────────
export const CONFIG_GRAPHIQUE = {
  hauteur:           500,
  couleur_cd4:       "#378ADD",
  couleur_cv:        "#E24B4A",
  couleur_grille:    "#e8e8e8",
  epaisseur_courbe:  2,
  rayon_point:       5,
  rayon_point_hover: 7,
};

// ── Types de bilan ────────────────────────────────────────────
export const TYPES_BILAN = {
  INITIAL:  "Initial",
  CONTROLE: "Contrôle",   // ✅ remplace SUIVI
};

export const COULEURS_TYPE_BILAN = {
  [TYPES_BILAN.INITIAL]:  "blue",
  [TYPES_BILAN.CONTROLE]: "green", // ✅ remplace SUIVI
};

// ── Unités médicales ─────────────────────────────────────────
export const UNITES = {
  CD4:         "cell/mm³",
  CV:          "copies/mL",
  CREATININE:  "mmol/L",    // ✅ remplace HGB
  PLAQUETTES:  "10³/mm³",
  LYMPHOCYTES: "10³/mm³",
};

// ── Messages vides ────────────────────────────────────────────
export const MESSAGES_VIDES = {
  kpis:      "Aucune donnée disponible pour ce patient",
  graphique: "Aucune mesure enregistrée",
  tableau:   "Aucun bilan enregistré pour ce patient",
};


// ── Sérologie HBV — couleurs par marqueur et résultat ────────
// AgHBs+  = mauvais (infection active)
// Anti-HBs+ = bon (immunité acquise)
// Anti-HBc+ = contact passé (surveiller co-infection)
export const COULEURS_HBV = {
  ag_hbs: {
    Positif: "#EF4444",   // rouge  — infection active
    Négatif: "#22C55E",   // vert   — pas d'infection active
  },
  anti_hbs: {
    Positif: "#22C55E",   // vert   — immunisé
    Négatif: "#F59E0B",   // ambre  — non immunisé
  },
  anti_hbc: {
    Positif: "#F59E0B",   // ambre  — contact antérieur
    Négatif: "#22C55E",   // vert   — jamais exposé
  },
};

export const COULEUR_HBV_INCONNU = "#9CA3AF"; // gris — non déterminé

// Seuil protecteur anti-HBs (UI/mL) — utilisé si valeur quantitative dispo
export const SEUIL_ANTI_HBS_PROTECTEUR = 10;

export const COULEURS_GRAPHIQUE = {
  OK: "#22C55E", // vert — normal / indétectable
  MID: "#F59E0B", // ambre — zone intermédiaire (CV uniquement)
  CRIT: "#EF4444", // rouge — critique
  OBJ: "#F59E0B", // ambre — ligne objectif CD4
};


