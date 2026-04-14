// models/biModel.js

import pool from "../config/db.js";

// ── Nouveaux cas par sexe et âge ─────────────────────────────
export const findNouveauxCasParSexeAge = async ({ annee, trimestre }) => {
  const { rows } = await pool.query(
    `SELECT
       gender,
       tranche_age,
       COUNT(*) AS nb
     FROM mv_nouveaux_cas
     WHERE annee = $1
       AND ($2::int IS NULL OR trimestre = $2)
     GROUP BY gender, tranche_age`,
    [annee, trimestre ?? null]
  );
  return rows;
};

// ── CD4 initial par sexe et âge ──────────────────────────────
export const findDiagnosticTardif = async ({ annee, trimestre }) => {
  const { rows } = await pool.query(
    `SELECT
       gender,
       tranche_age,
       seuil_cd4,
       COUNT(*) AS nb
     FROM mv_diagnostic_tardif
     WHERE annee = $1
       AND ($2::int IS NULL OR trimestre = $2)
     GROUP BY gender, tranche_age, seuil_cd4`,
    [annee, trimestre ?? null]
  );
  return rows;
};

// ── HSH / UDI / Transgenres ───────────────────────────────────
export const findPopulationsCles = async ({ annee, trimestre }) => {
  const { rows } = await pool.query(
    `SELECT
       groupe_age_pop,
       SUM(CASE WHEN is_hsh        THEN 1 ELSE 0 END) AS nb_hsh,
       SUM(CASE WHEN is_udi        THEN 1 ELSE 0 END) AS nb_udi,
       SUM(CASE WHEN is_transgenre THEN 1 ELSE 0 END) AS nb_transgenres
     FROM mv_nouveaux_cas
     WHERE annee = $1
       AND ($2::int IS NULL OR trimestre = $2)
     GROUP BY groupe_age_pop
     ORDER BY groupe_age_pop`,
    [annee, trimestre ?? null]
  );
  return rows;
};

export const findAnneesDisponibles = async () => {
  const { rows } = await pool.query(
    `SELECT DISTINCT annee
     FROM mv_nouveaux_cas
     ORDER BY annee DESC`
  );
  return rows.map((r) => r.annee);
};