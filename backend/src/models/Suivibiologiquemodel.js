import pool from "../config/db.js";

const SUBQUERY_PATIENT_ID = `(SELECT id FROM patients WHERE numero = $1)`;

// ── Zone 1 — KPIs : dernier CD4 + dernière CV + créatinine + sérologie HBV ──
export const getKpisByNumero = async (numero) => {

  const queryCD4 = `
    SELECT
      cd4_absolu,
      cd4_pourcent,
      date_cd4        AS date_cd4,
      traitement,
      traitement_code
    FROM vue_suivi_patient
    WHERE patient_id = ${SUBQUERY_PATIENT_ID}
      AND cd4_absolu IS NOT NULL
    ORDER BY date_cd4 DESC
    LIMIT 1
  `;

  const queryCV = `
    SELECT
      charge_virale_valeur,
      date_cv         AS date_cv,
      traitement,
      traitement_code
    FROM vue_suivi_patient
    WHERE patient_id = ${SUBQUERY_PATIENT_ID}
      AND charge_virale_valeur IS NOT NULL
    ORDER BY date_cv DESC
    LIMIT 1
  `;

  const queryCreatinine = `
    SELECT
      creatinine,
      date_bilan_biochimique  AS date_reference
    FROM vue_suivi_patient
    WHERE patient_id = ${SUBQUERY_PATIENT_ID}
      AND creatinine IS NOT NULL
    ORDER BY date_bilan_biochimique DESC
    LIMIT 1
  `;

  const queryCD4Precedent = `
    SELECT
      cd4_absolu,
      date_cd4
    FROM vue_suivi_patient
    WHERE patient_id = ${SUBQUERY_PATIENT_ID}
      AND cd4_absolu IS NOT NULL
    ORDER BY date_cd4 DESC
    LIMIT 2
  `;

  const queryCVPrecedent = `
    SELECT
      charge_virale_valeur,
      date_cv
    FROM vue_suivi_patient
    WHERE patient_id = ${SUBQUERY_PATIENT_ID}
      AND charge_virale_valeur IS NOT NULL
    ORDER BY date_cv DESC
    LIMIT 2
  `;

  const queryHBV = `
    SELECT
      vhb_ag_hbs         AS ag_hbs,
      vhb_ac_hbs         AS anti_hbs,
      vhb_ac_hbc         AS anti_hbc,
      date_serologie_vhb AS date
    FROM vue_suivi_patient
    WHERE patient_id = ${SUBQUERY_PATIENT_ID}
      AND date_serologie_vhb IS NOT NULL
      AND (
        vhb_ag_hbs  IS NOT NULL OR
        vhb_ac_hbs  IS NOT NULL OR
        vhb_ac_hbc  IS NOT NULL
      )
    ORDER BY date_serologie_vhb DESC
    LIMIT 1
  `;

  const [
    cd4Result,
    cvResult,
    creatinineResult,
    cd4PrecedentResult,
    cvPrecedentResult,
    hbvResult,
  ] = await Promise.all([
    pool.query(queryCD4,          [numero]),
    pool.query(queryCV,           [numero]),
    pool.query(queryCreatinine,   [numero]),
    pool.query(queryCD4Precedent, [numero]),
    pool.query(queryCVPrecedent,  [numero]),
    pool.query(queryHBV,          [numero]),
  ]);

  return {
    cd4:           cd4Result.rows[0]        || null,
    cv:            cvResult.rows[0]         || null,
    creatinine:    creatinineResult.rows[0] || null,
    cd4Historique: cd4PrecedentResult.rows,
    cvHistorique:  cvPrecedentResult.rows,
    serologie_hbv: hbvResult.rows[0]        || null,
  };
};

// ── Zone 2 — Graphique CD4 ───────────────────────────────────────────────────
export const getPointsCD4ByNumero = async (numero) => {
  const query = `
    SELECT
      resultat_id,
      date_point,
      cd4_absolu,
      cd4_pourcent,
      type_bilan,
      traitement,
      traitement_code,
      traitement_date_debut,
      traitement_date_fin
    FROM vue_points_cd4
    WHERE patient_id = ${SUBQUERY_PATIENT_ID}
    ORDER BY date_point ASC
  `;
  const result = await pool.query(query, [numero]);
  return result.rows;
};

// ── Zone 2 — Graphique CV ────────────────────────────────────────────────────
export const getPointsCVByNumero = async (numero) => {
  const query = `
    SELECT
      resultat_id,
      date_point,
      charge_virale_valeur,
      type_bilan,
      traitement,
      traitement_code,
      traitement_date_debut,
      traitement_date_fin
    FROM vue_points_cv
    WHERE patient_id = ${SUBQUERY_PATIENT_ID}
    ORDER BY date_point ASC
  `;
  const result = await pool.query(query, [numero]);
  return result.rows;
};

// ── Zone 2 — Périodes ARV ────────────────────────────────────────────────────
export const getPeriodesARVByNumero = async (numero) => {
  const query = `
    SELECT
      prescription_id,
      nom_medicament,
      code_medicament,
      date_debut,
      date_fin
    FROM vue_periodes_arv
    WHERE patient_id = ${SUBQUERY_PATIENT_ID}
    ORDER BY date_debut ASC
  `;
  const result = await pool.query(query, [numero]);
  return result.rows;
};

// ── Zone 3 — Tableau chronologique ───────────────────────────────────────────
export const getTableauByNumero = async (numero) => {
  const query = `
    SELECT
      id,
      bilan_id,
      date_cd4,
      date_cv,
      date_tri,
      cd4_absolu,
      cd4_pourcent,
      charge_virale_valeur,
      creatinine,
      plaquettes,
      globules_blancs,
      lymphocytes,
      traitement,
      traitement_code,
      traitement_date_debut,
      traitement_date_fin,
      type_bilan,
      observations
    FROM vue_suivi_patient
    WHERE patient_id = ${SUBQUERY_PATIENT_ID}
    ORDER BY date_tri DESC
  `;
  const result = await pool.query(query, [numero]);
  return result.rows;
};