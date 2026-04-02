import pool from "../config/db.js";

// ── Sous-requête réutilisable : numero → patient_id ───────────────────────────
// Utilisée dans toutes les requêtes pour éviter la répétition
const SUBQUERY_PATIENT_ID = `(SELECT id FROM patients WHERE numero = $1)`;

// ── Zone 1 — KPIs : dernier CD4 + dernière CV + hémoglobine ─────────────────
export const getKpisByNumero = async (numero) => {
  const queryCD4 = `
    SELECT
      cd4_absolu,
      cd4_pourcent,
      date_cd4        AS date_cd4,
      traitement,
      statut
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
      statut
    FROM vue_suivi_patient
    WHERE patient_id = ${SUBQUERY_PATIENT_ID}
      AND charge_virale_valeur IS NOT NULL
    ORDER BY date_cv DESC
    LIMIT 1
  `;

  const queryHGB = `
    SELECT
      hemoglobine,
      date_tri        AS date_reference
    FROM vue_suivi_patient
    WHERE patient_id = ${SUBQUERY_PATIENT_ID}
      AND hemoglobine IS NOT NULL
    ORDER BY date_tri DESC
    LIMIT 1
  `;

  const [cd4Result, cvResult, hgbResult] = await Promise.all([
    pool.query(queryCD4, [numero]),
    pool.query(queryCV,  [numero]),
    pool.query(queryHGB, [numero]),
  ]);

  return {
    cd4:         cd4Result.rows[0] || null,
    cv:          cvResult.rows[0]  || null,
    hemoglobine: hgbResult.rows[0] || null,
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
      medicament_id,
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
      hemoglobine,
      plaquettes,
      globules_blancs,
      lymphocytes,
      traitement,
      traitement_code,
      traitement_date_debut,
      traitement_date_fin,
      type_bilan,
      statut,
      observations
    FROM vue_suivi_patient
    WHERE patient_id = ${SUBQUERY_PATIENT_ID}
    ORDER BY date_tri DESC
  `;
  const result = await pool.query(query, [numero]);
  return result.rows;
};