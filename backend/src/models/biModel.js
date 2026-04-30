import pool from '../config/db.js';

// ============================================================
// HELPERS INTERNES
// ============================================================

// Construit le filtre WHERE annee + trimestre optionnel
// Retourne { clause, params }
const buildPeriodeFilter = (annee, trimestre, startIndex = 1) => {
  if (trimestre) {
    return {
      clause: `WHERE annee = $${startIndex} AND trimestre = $${startIndex + 1}`,
      params: [annee, trimestre],
    };
  }
  return {
    clause: `WHERE annee = $${startIndex}`,
    params: [annee],
  };
};


// ============================================================
// NOUVEAUX MALADES — mv_fait_nouveaux_malades
// ============================================================

// KPI 1 — Nombre de PVVIH nouvellement dépistés
// Grille : gender × tranche_8
export const findNouveauxDepistes = async ({ annee, trimestre }) => {
  const { clause, params } = buildPeriodeFilter(annee, trimestre);
  const { rows } = await pool.query(
    `SELECT gender, tranche_8, COUNT(*) AS total
     FROM mv_fait_nouveaux_malades
     ${clause}
     GROUP BY gender, tranche_8`,
    params
  );
  return rows;
};


// KPI 2 — Diagnostic tardif CD4 < 200
// Grille : gender × tranche_8
export const findDiagnosticTardifLt200 = async ({ annee, trimestre }) => {
  const { clause, params } = buildPeriodeFilter(annee, trimestre);
  const { rows } = await pool.query(
    `SELECT gender, tranche_8, COUNT(*) AS total
     FROM mv_fait_nouveaux_malades
     ${clause} AND seuil_cd4 = 'lt200'
     GROUP BY gender, tranche_8`,
    params
  );
  return rows;
};


// KPI 3 — Diagnostic tardif CD4 entre 200 et 350
// Grille : gender × tranche_8
export const findDiagnosticTardif200350 = async ({ annee, trimestre }) => {
  const { clause, params } = buildPeriodeFilter(annee, trimestre);
  const { rows } = await pool.query(
    `SELECT gender, tranche_8, COUNT(*) AS total
     FROM mv_fait_nouveaux_malades
     ${clause} AND seuil_cd4 = '200_350'
     GROUP BY gender, tranche_8`,
    params
  );
  return rows;
};


// KPI 4a — Populations clés : HSH
// Grille : gender × tranche_2
export const findPopClesHsh = async ({ annee, trimestre }) => {
  const { clause, params } = buildPeriodeFilter(annee, trimestre);
  const { rows } = await pool.query(
    `SELECT gender, tranche_2, COUNT(*) AS total
     FROM mv_fait_nouveaux_malades
     ${clause} AND is_hsh = true
     GROUP BY gender, tranche_2`,
    params
  );
  return rows;
};


// KPI 4b — Populations clés : UDI
// Grille : gender × tranche_2
export const findPopClesUdi = async ({ annee, trimestre }) => {
  const { clause, params } = buildPeriodeFilter(annee, trimestre);
  const { rows } = await pool.query(
    `SELECT gender, tranche_2, COUNT(*) AS total
     FROM mv_fait_nouveaux_malades
     ${clause} AND is_udi = true
     GROUP BY gender, tranche_2`,
    params
  );
  return rows;
};


// KPI 4c — Populations clés : PS
// Grille : gender × tranche_2
export const findPopClesPs = async ({ annee, trimestre }) => {
  const { clause, params } = buildPeriodeFilter(annee, trimestre);
  const { rows } = await pool.query(
    `SELECT gender, tranche_2, COUNT(*) AS total
     FROM mv_fait_nouveaux_malades
     ${clause} AND is_ps = true
     GROUP BY gender, tranche_2`,
    params
  );
  return rows;
};


// KPI 4d — Populations clés : Transgenres
// Grille : gender × tranche_2
export const findPopClesTransgenres = async ({ annee, trimestre }) => {
  const { clause, params } = buildPeriodeFilter(annee, trimestre);
  const { rows } = await pool.query(
    `SELECT gender, tranche_2, COUNT(*) AS total
     FROM mv_fait_nouveaux_malades
     ${clause} AND is_transgenre = true
     GROUP BY gender, tranche_2`,
    params
  );
  return rows;
};


// ============================================================
// FILE ACTIVE — mv_fait_file_active
// annee uniquement (pas de trimestre)
// ============================================================

// KPI 5 — Total file active
// Grille : gender × tranche_8
// Inclut TOUS les patients (statut_patient NULL = actifs)
export const findFileActiveTotal = async ({ annee }) => {
  const { rows } = await pool.query(
    `SELECT gender, tranche_8, COUNT(*) AS total
     FROM mv_fait_file_active
     WHERE annee = $1
     GROUP BY gender, tranche_8`,
    [annee]
  );
  return rows;
};


// KPI 6 — Charge virale de contrôle (CV > 6 mois après ARV)
// Grille : gender × tranche_8
export const findCvControle = async ({ annee }) => {
  const { rows } = await pool.query(
    `SELECT gender, tranche_8, COUNT(*) AS total
     FROM mv_fait_file_active
     WHERE annee = $1
       AND a_cv_controle = true
     GROUP BY gender, tranche_8`,
    [annee]
  );
  return rows;
};


// KPI 7 — Suppression virale CV < 1000
// Grille : gender × tranche_8
export const findSuppressionLt1000 = async ({ annee }) => {
  const { rows } = await pool.query(
    `SELECT gender, tranche_8, COUNT(*) AS total
     FROM mv_fait_file_active
     WHERE annee = $1
       AND est_supprime_lt1000 = true
     GROUP BY gender, tranche_8`,
    [annee]
  );
  return rows;
};


// KPI 8 — Suppression virale CV < 50
// Grille : gender × tranche_8
export const findSuppressionLt50 = async ({ annee }) => {
  const { rows } = await pool.query(
    `SELECT gender, tranche_8, COUNT(*) AS total
     FROM mv_fait_file_active
     WHERE annee = $1
       AND est_supprime_lt50 = true
     GROUP BY gender, tranche_8`,
    [annee]
  );
  return rows;
};

// KPI 7b — CV ≥ 1000 (échec virologique)
// Grille : gender × tranche_8
export const findSuppressionGt1000 = async ({ annee }) => {
  const { rows } = await pool.query(
    `SELECT gender, tranche_8, COUNT(*) AS total
     FROM mv_fait_file_active
     WHERE annee = $1
       AND statut_viral = 'gt1000'
     GROUP BY gender, tranche_8`,
    [annee]
  );
  return rows;
};

// KPI 9 — Décès liés au sida
// Grille : gender × tranche_3
export const findDecesSida = async ({ annee }) => {
  const { rows } = await pool.query(
    `SELECT gender, tranche_3, COUNT(*) AS total
     FROM mv_fait_file_active
     WHERE annee = $1
       AND statut_patient = 'decede_sida'
     GROUP BY gender, tranche_3`,
    [annee]
  );
  return rows;
};


// KPI 10 — Décès normaux
// Grille : gender × tranche_3
export const findDecesNormaux = async ({ annee }) => {
  const { rows } = await pool.query(
    `SELECT gender, tranche_3, COUNT(*) AS total
     FROM mv_fait_file_active
     WHERE annee = $1
       AND statut_patient = 'decede_normale'
     GROUP BY gender, tranche_3`,
    [annee]
  );
  return rows;
};


// KPI 11 — Perdus de vue
// Grille : gender × tranche_3
export const findPerdusDeVue = async ({ annee }) => {
  const { rows } = await pool.query(
    `SELECT gender, tranche_3, COUNT(*) AS total
     FROM mv_fait_file_active
     WHERE annee = $1
       AND statut_patient = 'perdu_de_vue'
     GROUP BY gender, tranche_3`,
    [annee]
  );
  return rows;
};


// KPI 12 — Récupération perdus de vue
// Grille : gender × tranche_8
export const findRecuperes = async ({ annee }) => {
  const { rows } = await pool.query(
    `SELECT gender, tranche_8, COUNT(*) AS total
     FROM mv_fait_file_active
     WHERE annee = $1
       AND statut_patient = 'recupere'
     GROUP BY gender, tranche_8`,
    [annee]
  );
  return rows;
};


// KPI 13 — Transferts
// Grille : gender × tranche_3
export const findTransferts = async ({ annee }) => {
  const { rows } = await pool.query(
    `SELECT gender, tranche_3, COUNT(*) AS total
     FROM mv_fait_file_active
     WHERE annee = $1
       AND statut_patient = 'transfere'
     GROUP BY gender, tranche_3`,
    [annee]
  );
  return rows;
};


// KPI 14 — Migrants
// Grille : gender × tranche_3
export const findMigrants = async ({ annee }) => {
  const { rows } = await pool.query(
    `SELECT gender, tranche_3, COUNT(*) AS total
     FROM mv_fait_file_active
     WHERE annee = $1
       AND statut_patient = 'migrant'
     GROUP BY gender, tranche_3`,
    [annee]
  );
  return rows;
};


// ============================================================
// UTILITAIRES
// ============================================================

// Années disponibles depuis v_dim_temps
export const findAnneesDisponibles = async () => {
  const { rows } = await pool.query(
    `SELECT DISTINCT annee
     FROM v_dim_temps
     ORDER BY annee DESC`
  );
  return rows.map((r) => r.annee);
};


// Refresh toutes les vues matérialisées dans l'ordre de dépendance
export const refreshAllMVs = async () => {
  const mvs = [
    'mv_dim_population',
    'mv_dim_statut_viral',
    'mv_dim_statut_patient',
    'mv_fait_nouveaux_malades',
    'mv_fait_file_active',
  ];

  for (const mv of mvs) {
    await pool.query(`REFRESH MATERIALIZED VIEW ${mv}`);
  }
};

// kpis pour nouveaux malades : 
// biModel.js — vérifier que cette fonction existe et est exportée
export const findClassificationCD4 = async ({ annee, trimestre }) => {
  const { clause, params } = buildPeriodeFilter(annee, trimestre);
  const { rows } = await pool.query(
    `SELECT
       tranche_8 AS tranche,
       COUNT(*) FILTER (WHERE seuil_cd4 = 'lt200')       AS lt200,
       COUNT(*) FILTER (WHERE seuil_cd4 = '200_350')     AS "200_350",
       COUNT(*) FILTER (WHERE seuil_cd4 = 'gt350')       AS gt350,
       COUNT(*) FILTER (WHERE seuil_cd4 = 'sans_mesure') AS sans_mesure
     FROM mv_fait_nouveaux_malades
     ${clause}
     GROUP BY tranche_8
     ORDER BY tranche_8`,
    params
  );
  return rows;
};