import {
  getKpisByNumero,
  getPointsCD4ByNumero,
  getPointsCVByNumero,
  getPeriodesARVByNumero,
  getTableauByNumero,
} from "../models/Suivibiologiquemodel.js";

// ── Helpers statut ────────────────────────────────────────────────────────────
const computeStatut = (cd4, cv) => {
  if (!cd4 && !cv)              return "Inconnu";
  if (cd4 < 200 || cv > 1000)  return "Critique";
  if (cd4 >= 200 && cd4 <= 500) return "Moyen";
  if (cd4 > 500)                return "Bon";
  return "Inconnu";
};

const computeAlertes = (cd4, cv, hemoglobine) => {
  const alertes = [];
  if (cd4 !== null && cd4 < 200)
    alertes.push({ type: "danger",  message: `CD4 critique : ${cd4} cell/mm³ (< 200)` });
  if (cv !== null && cv > 1000)
    alertes.push({ type: "danger",  message: `Charge virale élevée : ${cv} copies/mL (> 1 000)` });
  if (hemoglobine !== null && hemoglobine < 10)
    alertes.push({ type: "warning", message: `Hémoglobine basse : ${hemoglobine} g/dL (< 10)` });
  return alertes;
};

// ── Zone 1 — KPIs + alertes ──────────────────────────────────────────────────
export const getKpis = async (numero) => {
  const { cd4, cv, hemoglobine } = await getKpisByNumero(numero);

  const cd4Valeur = cd4?.cd4_absolu          ?? null;
  const cvValeur  = cv?.charge_virale_valeur  ?? null;
  const hgbValeur = hemoglobine?.hemoglobine  ?? null;

  return {
    cd4: {
      valeur:     cd4Valeur,
      pourcent:   cd4?.cd4_pourcent ?? null,
      date:       cd4?.date_cd4     ?? null,
      traitement: cd4?.traitement   ?? null,
    },
    cv: {
      valeur:     cvValeur,
      date:       cv?.date_cv       ?? null,
      traitement: cv?.traitement    ?? null,
    },
    hemoglobine: {
      valeur: hgbValeur,
      date:   hemoglobine?.date_reference ?? null,
    },
    statut:  computeStatut(cd4Valeur, cvValeur),
    alertes: computeAlertes(cd4Valeur, cvValeur, hgbValeur),
  };
};

// ── Zone 2 — Graphique CD4 ───────────────────────────────────────────────────
export const getGraphiqueCD4 = async (numero) => {
  const points = await getPointsCD4ByNumero(numero);
  return points.map((p) => ({
    date:                  p.date_point,
    cd4_absolu:            p.cd4_absolu,
    cd4_pourcent:          p.cd4_pourcent,
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
    hemoglobine:           r.hemoglobine           ?? null,
    plaquettes:            r.plaquettes            ?? null,
    globules_blancs:       r.globules_blancs       ?? null,
    lymphocytes:           r.lymphocytes           ?? null,
    traitement:            r.traitement            ?? null,
    traitement_code:       r.traitement_code       ?? null,
    traitement_date_debut: r.traitement_date_debut ?? null,
    traitement_date_fin:   r.traitement_date_fin   ?? null,
    type_bilan:            r.type_bilan,
    statut:                r.statut,
    observations:          r.observations          ?? null,
  }));
};