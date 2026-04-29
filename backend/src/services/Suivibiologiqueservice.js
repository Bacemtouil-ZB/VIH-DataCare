import {
  getKpisByNumero,
  getPointsCD4ByNumero,
  getPointsCVByNumero,
  getPeriodesARVByNumero,
  getTableauByNumero,
} from "../models/Suivibiologiquemodel.js";

/// ── Seuils et critères d'alerte ───────────────────────────────────────────────
export const SEUILS = {
  // CD4
  cd4_critique_max:     200,   // < 200 → Critique
  cd4_moyen_min:        200,   // 200-500 → Moyen
  cd4_moyen_max:        500,   // > 500 → Bon

  // Charge virale
  cv_critique_min:      1000,  // > 1000 → Critique

  // Alertes variation significative
  cd4_baisse_pourcent:  20,    // baisse > 20% → alerte
  cv_hausse_pourcent:   50,    // hausse > 50% → alerte

  // Créatinine
  creatinine_max:       120,   // > 120 µmol/L → alerte
};

// ── Helper : normaliser un résultat sérologique ───────────────────────────────
// PostgreSQL peut retourner : true/false (bool), "t"/"f" (pg shorthand),
// "Positif"/"Négatif", 1/0, ou des strings brutes du labo
const normaliserSerologie = (valeur) => {
  if (valeur == null) return null;
  if (valeur === true  || valeur === "t" || valeur === 1)    return "Positif";
  if (valeur === false || valeur === "f" || valeur === 0)    return "Négatif";
  const v = String(valeur).toLowerCase().trim();
  if (["positif", "reactif", "réactif", "oui"].includes(v)) return "Positif";
  if (["negatif", "négatif", "non reactif", "non réactif", "non"].includes(v))
                                                             return "Négatif";
  return null;
};

// ── Helper : calcul statut ────────────────────────────────────────────────────
const computeStatut = (cd4, cv) => {
  if (!cd4 && !cv)                                    return "Inconnu";
  if (cd4 < SEUILS.cd4_critique_max ||
      cv  > SEUILS.cv_critique_min)                   return "Critique";
  if (cd4 >= SEUILS.cd4_moyen_min &&
      cd4 <= SEUILS.cd4_moyen_max)                    return "Moyen";
  if (cd4 > SEUILS.cd4_moyen_max)                     return "Bon";
  return "Inconnu";
};

// ── Helper : calcul alertes ───────────────────────────────────────────────────
const computeAlertes = (cd4Actuel, cvActuel, cd4Precedent, cvPrecedent, creatinine) => {
  const alertes = [];

  // ── Alerte seuil absolu CD4 ──────────────────────────────────────────────
  if (cd4Actuel !== null && cd4Actuel < SEUILS.cd4_critique_max) {
    alertes.push({
      type:    "danger",
      message: `CD4 critique : ${cd4Actuel} cell/mm³ (< ${SEUILS.cd4_critique_max})`,
    });
  }

  // ── Alerte seuil absolu CV ───────────────────────────────────────────────
  if (cvActuel !== null && cvActuel > SEUILS.cv_critique_min) {
    alertes.push({
      type:    "danger",
      message: `Charge virale élevée : ${cvActuel} copies/mL (> ${SEUILS.cv_critique_min})`,
    });
  }

  // ── Alerte variation CD4 (comparaison 2 derniers résultats) ─────────────
  if (cd4Actuel !== null && cd4Precedent !== null) {
    const baissePourcent = ((cd4Precedent - cd4Actuel) / cd4Precedent) * 100;
    if (baissePourcent >= SEUILS.cd4_baisse_pourcent) {
      alertes.push({
        type:    "warning",
        message: `CD4 en baisse significative : -${baissePourcent.toFixed(1)}% par rapport au dernier résultat`,
      });
    }
  }

  // ── Alerte variation CV (comparaison 2 derniers résultats) ──────────────
  if (cvActuel !== null && cvPrecedent !== null) {
    const haussePourcent = ((cvActuel - cvPrecedent) / cvPrecedent) * 100;
    if (haussePourcent >= SEUILS.cv_hausse_pourcent) {
      alertes.push({
        type:    "warning",
        message: `Charge virale en hausse significative : +${haussePourcent.toFixed(1)}% par rapport au dernier résultat`,
      });
    }
  }

  // ── Alerte créatinine ────────────────────────────────────────────────────
  if (creatinine !== null && creatinine > SEUILS.creatinine_max) {
    alertes.push({
      type:    "warning",
      message: `Créatinine élevée : ${creatinine} µmol/L (> ${SEUILS.creatinine_max})`,
    });
  }

  return alertes;
};

// ── Zone 1 — KPIs + alertes ──────────────────────────────────────────────────
export const getKpis = async (numero) => {
  const { cd4, cv, creatinine, cd4Historique, cvHistorique, serologie_hbv } =
    await getKpisByNumero(numero);

  const cd4Actuel   = cd4?.cd4_absolu          ?? null;
  const cvActuel    = cv?.charge_virale_valeur  ?? null;
  const creatValeur = creatinine?.creatinine    ?? null;

  // Valeur précédente pour comparaison (index 1 = avant-dernier)
  const cd4Precedent = cd4Historique[1]?.cd4_absolu         ?? null;
  const cvPrecedent  = cvHistorique[1]?.charge_virale_valeur ?? null;

  // ── Sérologie HBV : normaliser chaque marqueur ───────────────────────────
  const hbv = serologie_hbv
    ? {
        ag_hbs:   normaliserSerologie(serologie_hbv.ag_hbs),
        anti_hbs: normaliserSerologie(serologie_hbv.anti_hbs),
        anti_hbc: normaliserSerologie(serologie_hbv.anti_hbc),
        date:     serologie_hbv.date ?? null,
      }
    : null;

  return {
    cd4: {
      valeur:     cd4Actuel,
      pourcent:   cd4?.cd4_pourcent  ?? null,
      date:       cd4?.date_cd4      ?? null,
      traitement: cd4?.traitement    ?? null,
    },
    cv: {
      valeur:     cvActuel,
      date:       cv?.date_cv        ?? null,
      traitement: cv?.traitement     ?? null,
    },
    creatinine: {
      valeur: creatValeur,
      date:   creatinine?.date_reference ?? null,
    },
    statut:        computeStatut(cd4Actuel, cvActuel),
    alertes:       computeAlertes(
      cd4Actuel,
      cvActuel,
      cd4Precedent,
      cvPrecedent,
      creatValeur
    ),
    serologie_hbv: hbv,   // ✅ { ag_hbs, anti_hbs, anti_hbc, date } | null
  };
};

// ── Zone 2 — Graphique CD4 ───────────────────────────────────────────────────
export const getGraphiqueCD4 = async (numero) => {
  const points = await getPointsCD4ByNumero(numero);
  return points.map((p) => ({
    date:                  p.date_point,
    cd4_absolu:            p.cd4_absolu,
    cd4_pourcent:          p.cd4_pourcent,
    type_bilan:            p.type_bilan,
    traitement:            p.traitement,
    traitement_code:       p.traitement_code,
    traitement_date_debut: p.traitement_date_debut,
    traitement_date_fin:   p.traitement_date_fin,
  }));
};

// ── Zone 2 — Graphique CV ────────────────────────────────────────────────────
export const getGraphiqueCV = async (numero) => {
  const points = await getPointsCVByNumero(numero);
  return points.map((p) => ({
    date:                  p.date_point,
    charge_virale_valeur:  p.charge_virale_valeur,
    type_bilan:            p.type_bilan,
    traitement:            p.traitement,
    traitement_code:       p.traitement_code,
    traitement_date_debut: p.traitement_date_debut,
    traitement_date_fin:   p.traitement_date_fin,
  }));
};

// ── Zone 2 — Périodes ARV ────────────────────────────────────────────────────
export const getPeriodesARV = async (numero) => {
  const periodes = await getPeriodesARVByNumero(numero);
  return periodes.map((p) => ({
    medicament_id:   p.medicament_id,
    nom_medicament:  p.nom_medicament,
    code_medicament: p.code_medicament,
    date_debut:      p.date_debut,
    date_fin:        p.date_fin ?? null,
    en_cours:        p.date_fin === null,
  }));
};

// ── Zone 3 — Tableau chronologique ───────────────────────────────────────────
export const getTableau = async (numero) => {
  const rows = await getTableauByNumero(numero);
  return rows.map((r) => ({
    id:                    r.id,
    bilan_id:              r.bilan_id,
    date_cd4:              r.date_cd4              ?? null,
    date_cv:               r.date_cv               ?? null,
    date_tri:              r.date_tri,
    cd4_absolu:            r.cd4_absolu            ?? null,
    cd4_pourcent:          r.cd4_pourcent          ?? null,
    charge_virale_valeur:  r.charge_virale_valeur  ?? null,
    creatinine:            r.creatinine            ?? null,
    plaquettes:            r.plaquettes            ?? null,
    globules_blancs:       r.globules_blancs       ?? null,
    lymphocytes:           r.lymphocytes           ?? null,
    traitement:            r.traitement            ?? null,
    traitement_code:       r.traitement_code       ?? null,
    traitement_date_debut: r.traitement_date_debut ?? null,
    traitement_date_fin:   r.traitement_date_fin   ?? null,
    type_bilan:            r.type_bilan,
    statut:                computeStatut(          // ✅ calculé backend
      r.cd4_absolu ?? null,
      r.charge_virale_valeur ?? null
    ),
    observations:          r.observations          ?? null,
  }));
};