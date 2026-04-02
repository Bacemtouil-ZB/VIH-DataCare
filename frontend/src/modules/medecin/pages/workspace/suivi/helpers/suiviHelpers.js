// ============================================================
//  suiviHelpers.js
//  Fonctions pures utilitaires pour le dashboard Suivi VIH
//  Aucun appel API, aucun state — transformations uniquement
// ============================================================

import {
  SEUILS_CD4,
  SEUILS_CV,
  SEUILS_HGB,
  STATUTS,
  COULEURS_STATUT,
  COULEURS_STATUT_HEX,
  COULEURS_ARV,
} from "../constants/suiviConstants";


// ── Formatage dates ───────────────────────────────────────────────────────────

/**
 * Formate une date PostgreSQL en "01/07/2024"
 * @param {string|null} dateStr - "2024-07-01" depuis l'API
 * @returns {string} "01/07/2024" ou "---" si null
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "---";
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day:   "2-digit",
    month: "2-digit",
    year:  "numeric",
  });
};

/**
 * Formate une date pour l'axe X de Recharts (plus court)
 * @param {string|null} dateStr - "2024-07-01"
 * @returns {string} "Juil 24"
 */
export const formatDateRecharts = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    month: "short",
    year:  "2-digit",
  });
};


// ── Formatage valeurs médicales ───────────────────────────────────────────────

/**
 * Formate la charge virale
 * @param {number|null} valeur - ex: 167000
 * @returns {string} "167 000" ou "Indétectable" ou "---"
 */
export const formatCV = (valeur) => {
  if (valeur === null || valeur === undefined) return "---";
  if (valeur < SEUILS_CV.INDETECTABLE) return "Indétectable";
  return valeur.toLocaleString("fr-FR");
};

/**
 * Formate le CD4
 * @param {number|null} valeur - ex: 540
 * @returns {string} "540" ou "---"
 */
export const formatCD4 = (valeur) => {
  if (valeur === null || valeur === undefined) return "---";
  return valeur.toLocaleString("fr-FR");
};

/**
 * Formate l'hémoglobine
 * @param {number|null} valeur - ex: 10.2
 * @returns {string} "10.2" ou "---"
 */
export const formatHGB = (valeur) => {
  if (valeur === null || valeur === undefined) return "---";
  const num = parseFloat(valeur);
  if (isNaN(num)) return "---";
  return num.toFixed(1);
};


// ── Statuts et couleurs ───────────────────────────────────────────────────────

/**
 * Retourne le statut Ant Design color d'un CD4
 * @param {number|null} valeur
 * @returns {string} "error" | "warning" | "success" | "default"
 */
export const getCD4AntColor = (valeur) => {
  if (valeur === null || valeur === undefined) return COULEURS_STATUT[STATUTS.INCONNU];
  if (valeur < SEUILS_CD4.CRITIQUE)  return COULEURS_STATUT[STATUTS.CRITIQUE];
  if (valeur <= SEUILS_CD4.MOYEN_MAX) return COULEURS_STATUT[STATUTS.MOYEN];
  return COULEURS_STATUT[STATUTS.BON];
};

/**
 * Retourne la couleur hex d'un CD4 (pour Recharts dots)
 * @param {number|null} valeur
 * @returns {string} couleur hex
 */
export const getCD4HexColor = (valeur) => {
  if (valeur === null || valeur === undefined) return COULEURS_STATUT_HEX[STATUTS.INCONNU];
  if (valeur < SEUILS_CD4.CRITIQUE)   return COULEURS_STATUT_HEX[STATUTS.CRITIQUE];
  if (valeur <= SEUILS_CD4.MOYEN_MAX) return COULEURS_STATUT_HEX[STATUTS.MOYEN];
  return COULEURS_STATUT_HEX[STATUTS.BON];
};

/**
 * Retourne le statut Ant Design color d'une charge virale
 * @param {number|null} valeur
 * @returns {string} "error" | "warning" | "success" | "default"
 */
export const getCVAntColor = (valeur) => {
  if (valeur === null || valeur === undefined) return COULEURS_STATUT[STATUTS.INCONNU];
  if (valeur > SEUILS_CV.DETECTABLE)   return COULEURS_STATUT[STATUTS.CRITIQUE];
  if (valeur > SEUILS_CV.INDETECTABLE) return COULEURS_STATUT[STATUTS.MOYEN];
  return COULEURS_STATUT[STATUTS.BON];
};

/**
 * Retourne le statut Ant Design color d'une hémoglobine
 * @param {number|null} valeur
 * @returns {string} "error" | "warning" | "success" | "default"
 */
export const getHGBAntColor = (valeur) => {
  if (valeur === null || valeur === undefined) return COULEURS_STATUT[STATUTS.INCONNU];
  if (valeur < SEUILS_HGB.CRITIQUE) return COULEURS_STATUT[STATUTS.CRITIQUE];
  if (valeur < SEUILS_HGB.NORMAL)   return COULEURS_STATUT[STATUTS.MOYEN];
  return COULEURS_STATUT[STATUTS.BON];
};


// ── Données Recharts ──────────────────────────────────────────────────────────

/**
 * Prépare les points CD4 pour Recharts
 * Recharts a besoin de l'axe X en string formatée
 * @param {Array} points - depuis getGraphiqueCD4()
 * @returns {Array} [{ date, dateFormatee, cd4_absolu, traitement }]
 */
export const prepareDataCD4 = (points = []) => {
  return points.map((p) => ({
    ...p,
    date:         p.date,                      // gardé pour ReferenceArea (comparaison)
    dateFormatee: formatDateRecharts(p.date),  // affiché sur axe X
  }));
};

/**
 * Prépare les points CV pour Recharts
 * @param {Array} points - depuis getGraphiqueCV()
 * @returns {Array} [{ date, dateFormatee, charge_virale_valeur, traitement }]
 */
export const prepareDataCV = (points = []) => {
  return points.map((p) => ({
    ...p,
    date:         p.date,
    dateFormatee: formatDateRecharts(p.date),
  }));
};

/**
 * Retourne la couleur ARV selon l'index du traitement
 * @param {number} index - position dans la liste des périodes
 * @returns {{ fill: string, stroke: string }}
 */
export const getCouleurARV = (index) => {
  return COULEURS_ARV[index % COULEURS_ARV.length];
};

/**
 * Formate le tooltip Recharts pour la CV
 * Affiche "Indétectable" si < 200 sinon la valeur formatée
 * @param {number|null} valeur
 * @returns {string}
 */
export const formatTooltipCV = (valeur) => {
  if (valeur === null || valeur === undefined) return "---";
  if (valeur < SEUILS_CV.INDETECTABLE) return "Indétectable";
  return `${valeur.toLocaleString("fr-FR")} copies/mL`;
};

/**
 * Formate le tooltip Recharts pour le CD4
 * @param {number|null} valeur
 * @returns {string}
 */
export const formatTooltipCD4 = (valeur) => {
  if (valeur === null || valeur === undefined) return "---";
  return `${valeur.toLocaleString("fr-FR")} cell/mm³`;
};


// ── Calcul durée traitement ───────────────────────────────────────────────────

/**
 * Calcule la durée d'un traitement en mois
 * @param {string} dateDebut - "2024-01-01"
 * @param {string|null} dateFin - "2024-06-30" ou null si en cours
 * @returns {string} "6 mois" ou "en cours"
 */
export const getDureeTraitement = (dateDebut, dateFin) => {
  if (!dateDebut) return "---";
  const debut = new Date(dateDebut);
  const fin   = dateFin ? new Date(dateFin) : new Date();
  const mois  = Math.round((fin - debut) / (1000 * 60 * 60 * 24 * 30));
  if (!dateFin) return `${mois} mois (en cours)`;
  return `${mois} mois`;
};