
import {
  SEUILS_CD4,
  SEUILS_CV,
  SEUILS_CREATININE,   
  STATUTS,
  COULEURS_STATUT,
  COULEURS_STATUT_HEX,
  COULEURS_ARV,
} from "../constants/suiviConstants";

// ── Formatage dates ───────────────────────────────────────────
export const formatDate = (dateStr) => {
  if (!dateStr) return "---";
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day:   "2-digit",
    month: "2-digit",
    year:  "numeric",
  });
};

export const formatDateRecharts = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    month: "short",
    year:  "2-digit",
  });
};

// ── Formatage valeurs médicales ───────────────────────────────
export const formatCV = (valeur) => {
  if (valeur === null || valeur === undefined) return "---";
  return valeur.toLocaleString("fr-FR");
};

export const formatCD4 = (valeur) => {
  if (valeur === null || valeur === undefined) return "---";
  return valeur.toLocaleString("fr-FR");
};

export const formatCreatinine = (valeur) => {  
  if (valeur === null || valeur === undefined) return "---";
  const num = parseFloat(valeur);
  if (isNaN(num)) return "---";
  return num.toFixed(2);
};

// ── Statuts et couleurs ───────────────────────────────────────
export const getCD4AntColor = (valeur) => {
  if (valeur === null || valeur === undefined) return COULEURS_STATUT[STATUTS.INCONNU];
  if (valeur < SEUILS_CD4.CRITIQUE)   return COULEURS_STATUT[STATUTS.CRITIQUE];
  if (valeur <= SEUILS_CD4.MOYEN_MAX) return COULEURS_STATUT[STATUTS.MOYEN];
  return COULEURS_STATUT[STATUTS.BON];
};

export const getCD4HexColor = (valeur) => {
  if (valeur === null || valeur === undefined) return COULEURS_STATUT_HEX[STATUTS.INCONNU];
  if (valeur < SEUILS_CD4.CRITIQUE)   return COULEURS_STATUT_HEX[STATUTS.CRITIQUE];
  if (valeur <= SEUILS_CD4.MOYEN_MAX) return COULEURS_STATUT_HEX[STATUTS.MOYEN];
  return COULEURS_STATUT_HEX[STATUTS.BON];
};

export const getCVAntColor = (valeur) => {
  if (valeur === null || valeur === undefined) return COULEURS_STATUT[STATUTS.INCONNU];
  if (valeur > SEUILS_CV.DETECTABLE)   return COULEURS_STATUT[STATUTS.CRITIQUE];
  if (valeur > SEUILS_CV.INDETECTABLE) return COULEURS_STATUT[STATUTS.MOYEN];
  return COULEURS_STATUT[STATUTS.BON];
};

export const getCreatinineAntColor = (valeur) => { 
  if (valeur === null || valeur === undefined) return COULEURS_STATUT[STATUTS.INCONNU];
  if (valeur > SEUILS_CREATININE.CRITIQUE) return COULEURS_STATUT[STATUTS.CRITIQUE];
  if (valeur > SEUILS_CREATININE.NORMAL)   return COULEURS_STATUT[STATUTS.MOYEN];
  return COULEURS_STATUT[STATUTS.BON];
};

// ── Données Recharts ──────────────────────────────────────────
export const prepareDataCD4 = (points = []) => {
  return points.map((p) => ({
    ...p,
    date:         p.date,
    dateFormatee: formatDateRecharts(p.date),
  }));
};

export const prepareDataCV = (points = []) => {
  return points.map((p) => ({
    ...p,
    date:         p.date,
    dateFormatee: formatDateRecharts(p.date),
  }));
};

export const getCouleurARV = (index) => {
  return COULEURS_ARV[index % COULEURS_ARV.length];
};

export const formatTooltipCV = (valeur) => {
  if (valeur === null || valeur === undefined) return "---";
  //if (valeur < SEUILS_CV.INDETECTABLE) return "Indétectable";
  return `${valeur.toLocaleString("fr-FR")} copies/mL`;
};

export const formatTooltipCD4 = (valeur) => {
  if (valeur === null || valeur === undefined) return "---";
  return `${valeur.toLocaleString("fr-FR")} cell/mm³`;
};

// ── Calcul durée traitement ───────────────────────────────────
export const getDureeTraitement = (dateDebut, dateFin) => {
  if (!dateDebut) return "---";
  const debut = new Date(dateDebut);
  const fin   = dateFin ? new Date(dateFin) : new Date();
  const mois  = Math.round((fin - debut) / (1000 * 60 * 60 * 24 * 30));
  if (!dateFin) return `${mois} mois (en cours)`;
  return `${mois} mois`;
};

// cards de serologie VHB
import { COULEUR_HBV_INCONNU } from "../constants/suiviConstants";


export const getHBVHexColor = (marqueur, valeur) => {
  if (!valeur) return COULEUR_HBV_INCONNU;

  const normalizedValue = String(valeur).trim().toLowerCase();

  if (normalizedValue === "positif") return "#DC2626";
  if (normalizedValue === "négatif" || normalizedValue === "negatif") {
    return "#16A34A";
  }

  return COULEUR_HBV_INCONNU;
};


export const getHBVSignification = (marqueur, valeur) => {
  if (!valeur) return "Non déterminé";
  const map = {
    ag_hbs: {
      Positif: "Infection active",
      Négatif: "Pas d'infection active",
    },
    anti_hbs: {
      Positif: "Immunisé",
      Négatif: "Non immunisé — vaccination à envisager",
    },
    anti_hbc: {
      Positif: "Contact antérieur VHB",
      Négatif: "Jamais exposé au VHB",
    },
  };
  return map[marqueur]?.[valeur] ?? "Non déterminé";

};