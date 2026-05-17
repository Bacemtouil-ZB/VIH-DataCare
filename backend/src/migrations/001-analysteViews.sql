-- ============================================================
-- V1 — v_dim_temps
-- ============================================================

CREATE OR REPLACE VIEW v_dim_temps AS
SELECT DISTINCT
  EXTRACT(YEAR    FROM date_vih_positif)::int AS annee,
  EXTRACT(QUARTER FROM date_vih_positif)::int AS trimestre,
  EXTRACT(MONTH   FROM date_vih_positif)::int AS mois
FROM vih
WHERE date_vih_positif IS NOT NULL;

-- ============================================================
-- V2 — v_dim_patient
-- ============================================================

CREATE OR REPLACE VIEW v_dim_patient AS
SELECT
  id AS patient_id,
  gender,
  birthdate
FROM patients;

-- ============================================================
-- V4 — mv_dim_population
-- ============================================================

DROP MATERIALIZED VIEW IF EXISTS mv_dim_population;

CREATE MATERIALIZED VIEW mv_dim_population AS

WITH

hsh_patients AS (
  SELECT DISTINCT v.patient_id
  FROM vih v
  JOIN patients p ON p.id = v.patient_id
  WHERE (
    v.mode_contamination ILIKE '%Homosexuel%'
    OR v.mode_contamination ILIKE '%Bisexuel%'
  )
  AND p.gender = 'homme'
),

udi_patients AS (
  SELECT DISTINCT patient_id FROM (
    SELECT patient_id
    FROM habitudes_vie
    WHERE drogues_injectables = true
    UNION
    SELECT patient_id
    FROM vih
    WHERE mode_contamination ILIKE '%Toxicomanie IV%'
  ) udi_combined
),

ps_patients AS (
  SELECT DISTINCT patient_id
  FROM social
  WHERE activite_professionnelle = 'professionnelle_du_sexe'
)

SELECT
  p.id                                                          AS patient_id,
  CASE WHEN hsh.patient_id IS NOT NULL THEN true ELSE false END AS is_hsh,
  CASE WHEN udi.patient_id IS NOT NULL THEN true ELSE false END AS is_udi,
  CASE WHEN ps.patient_id  IS NOT NULL THEN true ELSE false END AS is_ps,
  CASE WHEN p.gender = 'transgenre'    THEN true ELSE false END AS is_transgenre
FROM patients p
LEFT JOIN hsh_patients hsh ON hsh.patient_id = p.id
LEFT JOIN udi_patients udi ON udi.patient_id = p.id
LEFT JOIN ps_patients  ps  ON ps.patient_id  = p.id;

CREATE UNIQUE INDEX idx_mv_dim_population_pid
  ON mv_dim_population (patient_id);


-- ============================================================
-- V5 — mv_dim_statut_viral
-- ============================================================

DROP MATERIALIZED VIEW IF EXISTS mv_dim_statut_viral; 

CREATE MATERIALIZED VIEW mv_dim_statut_viral AS

WITH derniere_cv AS (
  SELECT DISTINCT ON (patient_id)
    patient_id,
    charge_virale_valeur,
    date_charge_virale_vih
  FROM resultats_biologiques
  WHERE charge_virale_valeur IS NOT NULL
    AND date_charge_virale_vih IS NOT NULL
  ORDER BY patient_id, date_charge_virale_vih DESC
)

SELECT
  patient_id,
  charge_virale_valeur,
  CASE
    WHEN charge_virale_valeur < 50   THEN 'lt50'
    WHEN charge_virale_valeur < 1000 THEN 'lt1000'
    ELSE                                  'gt1000' 
  END AS statut_viral
FROM derniere_cv;

CREATE UNIQUE INDEX idx_mv_dim_statut_viral_pid
  ON mv_dim_statut_viral (patient_id);


-- ============================================================
-- V6 — mv_dim_statut_patient
-- Correction : ajout de id DESC comme tiebreaker dans
--              DISTINCT ON pour éviter résultat non déterministe
--              quand updated_at est identique sur deux lignes
-- ============================================================

DROP MATERIALIZED VIEW IF EXISTS mv_dim_statut_patient;

CREATE MATERIALIZED VIEW mv_dim_statut_patient AS

WITH dernier_suivi AS (
  SELECT DISTINCT ON (patient_id)
    patient_id,
    statut_patient
  FROM suivi_therapeutique
  ORDER BY patient_id, updated_at DESC, id DESC  
)

SELECT
  p.id AS patient_id,
  CASE
    WHEN p.status = 'decede'                    THEN 'decede_normale'
    WHEN p.status = 'decede_sida'               THEN 'decede_sida'
    WHEN p.status = 'transfere'                 THEN 'transfere'
    WHEN p.status IN ('migrant','migrant_inactif') THEN 'migrant'
    WHEN ds.statut_patient = 'perdu_de_vue'     THEN 'perdu_de_vue'
    WHEN ds.statut_patient = 'recupere'         THEN 'recupere'
    ELSE NULL
  END AS statut
FROM patients p
LEFT JOIN dernier_suivi ds ON ds.patient_id = p.id
WHERE (
  p.status IN ('decede','decede_sida','transfere','migrant','migrant_inactif')
  OR ds.statut_patient IN ('perdu_de_vue','recupere')
);

CREATE UNIQUE INDEX idx_mv_dim_statut_patient_pid
  ON mv_dim_statut_patient (patient_id);


-----------------27/04/2026 update -----------------

CREATE MATERIALIZED VIEW mv_fait_nouveaux_malades AS

WITH vih_unique AS (
  SELECT DISTINCT ON (patient_id)
    patient_id,
    date_vih_positif
  FROM vih
  WHERE date_vih_positif IS NOT NULL
  ORDER BY patient_id, date_vih_positif ASC
),

-- Calcul de l'âge à la date du diagnostic
age_diag AS (
  SELECT
    p.patient_id,
    p.gender,
    vu.date_vih_positif,
    EXTRACT(YEAR FROM AGE(vu.date_vih_positif, p.birthdate))::int AS age_annees
  FROM v_dim_patient p
  JOIN vih_unique vu ON vu.patient_id = p.patient_id
),

-- Premier CD4 après diagnostic (absorbé)
premier_cd4 AS (
  SELECT DISTINCT ON (rb.patient_id)
    rb.patient_id,
    rb.cd4_absolu
  FROM resultats_biologiques rb
  JOIN vih_unique v ON v.patient_id = rb.patient_id
  WHERE rb.cd4_absolu IS NOT NULL
    AND rb.date_resultat IS NOT NULL
    AND rb.date_resultat >= v.date_vih_positif
  ORDER BY rb.patient_id, rb.date_resultat ASC
)

SELECT
  ad.patient_id,
  ad.gender,

  -- Temps
  EXTRACT(YEAR    FROM ad.date_vih_positif)::int AS annee,
  EXTRACT(QUARTER FROM ad.date_vih_positif)::int AS trimestre,

  -- Tranche d’âge 8 classes (âge au diagnostic)
  CASE
    WHEN ad.age_annees < 1  THEN '<1an'
    WHEN ad.age_annees < 5  THEN '1-4ans'
    WHEN ad.age_annees < 10 THEN '5-9ans'
    WHEN ad.age_annees < 15 THEN '10-14ans'
    WHEN ad.age_annees < 20 THEN '15-19ans'
    WHEN ad.age_annees < 25 THEN '20-24ans'
    WHEN ad.age_annees < 50 THEN '25-49ans'
    ELSE '>50ans'
  END AS tranche_8,

  -- Tranche d’âge 2 classes
  CASE
    WHEN ad.age_annees < 25 THEN '<25ans'
    ELSE '>=25ans'
  END AS tranche_2,

  -- Populations clés
  pop.is_hsh,
  pop.is_udi,
  pop.is_ps,
  pop.is_transgenre,

  -- Seuil CD4 au diagnostic
  CASE
    WHEN pc.patient_id IS NULL THEN 'sans_mesure'
    WHEN pc.cd4_absolu < 200   THEN 'lt200'
    WHEN pc.cd4_absolu <= 350  THEN '200_350'
    ELSE                            'gt350'
  END AS seuil_cd4

FROM age_diag ad
LEFT JOIN mv_dim_population pop ON pop.patient_id = ad.patient_id
LEFT JOIN premier_cd4 pc        ON pc.patient_id  = ad.patient_id;

-- Index (inchangés)
CREATE UNIQUE INDEX idx_mv_fait_nouveaux_pid
  ON mv_fait_nouveaux_malades (patient_id);
CREATE INDEX idx_mv_fait_nouveaux_annee
  ON mv_fait_nouveaux_malades (annee);
CREATE INDEX idx_mv_fait_nouveaux_trimestre
  ON mv_fait_nouveaux_malades (annee, trimestre);
CREATE INDEX idx_mv_fait_nouveaux_seuil
  ON mv_fait_nouveaux_malades (seuil_cd4);

----------------------------------------
----------------------------------------
CREATE OR REPLACE VIEW v_dim_age AS
SELECT
  patient_id,
  CASE
    WHEN age_annees < 1  THEN '<1an'
    WHEN age_annees < 5  THEN '1-4ans'
    WHEN age_annees < 10 THEN '5-9ans'
    WHEN age_annees < 15 THEN '10-14ans'
    WHEN age_annees < 20 THEN '15-19ans'
    WHEN age_annees < 25 THEN '20-24ans'
    WHEN age_annees < 50 THEN '25-49ans'
    ELSE '>50ans'
  END AS tranche_8,
  CASE
    WHEN age_annees < 5  THEN '<5ans'
    WHEN age_annees < 15 THEN '5-14ans'
    ELSE '>15ans'
  END AS tranche_3
FROM (
  SELECT
    patient_id,
    EXTRACT(YEAR FROM AGE(NOW(), birthdate))::int AS age_annees
  FROM v_dim_patient
) sub;


-------------------------------------
----------------table de fait file active 
----------------------------------------
DROP MATERIALIZED VIEW IF EXISTS mv_fait_file_active;

CREATE MATERIALIZED VIEW mv_fait_file_active AS

WITH
premiere_prescription AS (
  SELECT
    patient_id,
    MIN(date) AS date_debut_arv
  FROM prescription_medicale
  GROUP BY patient_id
),

cv_controle AS (
  SELECT DISTINCT ON (rb.patient_id)
    rb.patient_id,
    rb.charge_virale_valeur AS cv_controle_valeur,
    rb.date_charge_virale_vih
  FROM resultats_biologiques rb
  JOIN premiere_prescription pp ON pp.patient_id = rb.patient_id
  WHERE rb.charge_virale_valeur IS NOT NULL
    AND rb.date_charge_virale_vih IS NOT NULL
    AND pp.date_debut_arv <= NOW() - INTERVAL '6 months'
    AND rb.date_charge_virale_vih >= pp.date_debut_arv + INTERVAL '6 months'  -- CORRECTION
  ORDER BY rb.patient_id, rb.date_charge_virale_vih DESC
)

SELECT
  p.patient_id,
  p.gender,
  EXTRACT(YEAR FROM NOW())::int AS annee,
  a.tranche_8,
  a.tranche_3,
  pop.is_hsh,
  pop.is_udi,
  pop.is_ps,
  pop.is_transgenre,
  COALESCE(sv.statut_viral, 'sans_mesure') AS statut_viral,
  CASE WHEN cvc.patient_id IS NOT NULL THEN true ELSE false END AS a_cv_controle,
  CASE WHEN sv.statut_viral IN ('lt50','lt1000') THEN true ELSE false END AS est_supprime_lt1000,
  CASE WHEN sv.statut_viral = 'lt50' THEN true ELSE false END AS est_supprime_lt50,
  sp.statut AS statut_patient
FROM v_dim_patient p
JOIN v_dim_age a                   ON a.patient_id  = p.patient_id
LEFT JOIN mv_dim_population   pop  ON pop.patient_id = p.patient_id
LEFT JOIN mv_dim_statut_viral sv   ON sv.patient_id  = p.patient_id
LEFT JOIN mv_dim_statut_patient sp ON sp.patient_id  = p.patient_id
LEFT JOIN cv_controle cvc          ON cvc.patient_id = p.patient_id;

-- Index
CREATE UNIQUE INDEX idx_mv_fait_file_active_pid
  ON mv_fait_file_active (patient_id);
CREATE INDEX idx_mv_fait_file_active_annee
  ON mv_fait_file_active (annee);
CREATE INDEX idx_mv_fait_file_active_statut
  ON mv_fait_file_active (statut_patient);
CREATE INDEX idx_mv_fait_file_active_viral
  ON mv_fait_file_active (statut_viral);





