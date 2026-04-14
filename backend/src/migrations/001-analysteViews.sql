DROP MATERIALIZED VIEW IF EXISTS mv_nouveaux_cas;

CREATE MATERIALIZED VIEW mv_nouveaux_cas AS
WITH

vih_unique AS (
  SELECT DISTINCT ON (patient_id)
    patient_id,
    date_vih_positif,
    mode_contamination
  FROM vih
  WHERE date_vih_positif IS NOT NULL
  ORDER BY patient_id, date_vih_positif ASC
),

-- ✅ LIKE pour détecter "Homosexuel" ou "Bisexuel" dans la chaîne
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

-- ✅ LIKE pour détecter "Toxicomanie IV" dans la chaîne
udi_patients AS (
  SELECT DISTINCT patient_id
  FROM (
    SELECT patient_id
    FROM habitudes_vie
    WHERE drogues_injectables = true

    UNION

    SELECT patient_id
    FROM vih
    WHERE mode_contamination ILIKE '%Toxicomanie IV%'
  ) udi_combined
)

SELECT
  p.id                                                      AS patient_id,
  p.gender,
  EXTRACT(YEAR    FROM v.date_vih_positif)::int             AS annee,
  EXTRACT(QUARTER FROM v.date_vih_positif)::int             AS trimestre,
  CASE
    WHEN EXTRACT(YEAR FROM AGE(v.date_vih_positif, p.birthdate)) < 1  THEN '<1an'
    WHEN EXTRACT(YEAR FROM AGE(v.date_vih_positif, p.birthdate)) < 5  THEN '1-4ans'
    WHEN EXTRACT(YEAR FROM AGE(v.date_vih_positif, p.birthdate)) < 10 THEN '5-9ans'
    WHEN EXTRACT(YEAR FROM AGE(v.date_vih_positif, p.birthdate)) < 15 THEN '10-14ans'
    WHEN EXTRACT(YEAR FROM AGE(v.date_vih_positif, p.birthdate)) < 20 THEN '15-19ans'
    WHEN EXTRACT(YEAR FROM AGE(v.date_vih_positif, p.birthdate)) < 25 THEN '20-24ans'
    WHEN EXTRACT(YEAR FROM AGE(v.date_vih_positif, p.birthdate)) < 50 THEN '25-49ans'
    ELSE '>50ans'
  END                                                       AS tranche_age,
  CASE
    WHEN EXTRACT(YEAR FROM AGE(v.date_vih_positif, p.birthdate)) < 25
    THEN 'lt25' ELSE 'gte25'
  END                                                       AS groupe_age_pop,
  CASE WHEN hsh.patient_id IS NOT NULL THEN true ELSE false END  AS is_hsh,
  CASE WHEN ud.patient_id  IS NOT NULL THEN true ELSE false END  AS is_udi,
  CASE WHEN p.gender = 'transgenre'   THEN true ELSE false END   AS is_transgenre

FROM patients p
JOIN vih_unique v   ON v.patient_id = p.id
LEFT JOIN udi_patients ud  ON ud.patient_id  = p.id
LEFT JOIN hsh_patients hsh ON hsh.patient_id = p.id;

CREATE UNIQUE INDEX idx_mv_nouveaux_cas_pid
  ON mv_nouveaux_cas (patient_id);


CREATE MATERIALIZED VIEW mv_diagnostic_tardif AS
WITH premier_cd4 AS (
  SELECT DISTINCT ON (rb.patient_id)
    rb.patient_id,
    rb.cd4_absolu,
    rb.date_resultat
  FROM resultats_biologiques rb
  JOIN vih v ON v.patient_id = rb.patient_id
  WHERE rb.cd4_absolu IS NOT NULL
    AND rb.date_resultat >= v.date_vih_positif
  ORDER BY rb.patient_id, rb.date_resultat ASC
)
SELECT
  p.id                          AS patient_id,
  p.gender,
  EXTRACT(YEAR FROM v.date_vih_positif)::int               AS annee,
  EXTRACT(QUARTER FROM v.date_vih_positif)::int            AS trimestre,
  CASE
    WHEN EXTRACT(YEAR FROM AGE(v.date_vih_positif, p.birthdate)) < 1  THEN '<1an'
    WHEN EXTRACT(YEAR FROM AGE(v.date_vih_positif, p.birthdate)) < 5  THEN '1-4ans'
    WHEN EXTRACT(YEAR FROM AGE(v.date_vih_positif, p.birthdate)) < 10 THEN '5-9ans'
    WHEN EXTRACT(YEAR FROM AGE(v.date_vih_positif, p.birthdate)) < 15 THEN '10-14ans'
    WHEN EXTRACT(YEAR FROM AGE(v.date_vih_positif, p.birthdate)) < 20 THEN '15-19ans'
    WHEN EXTRACT(YEAR FROM AGE(v.date_vih_positif, p.birthdate)) < 25 THEN '20-24ans'
    WHEN EXTRACT(YEAR FROM AGE(v.date_vih_positif, p.birthdate)) < 50 THEN '25-49ans'
    ELSE '>50ans'
  END                                                      AS tranche_age,
  pc.cd4_absolu,
  CASE
    WHEN pc.cd4_absolu IS NULL     THEN 'sans_mesure'
    WHEN pc.cd4_absolu < 200       THEN 'lt200'
    WHEN pc.cd4_absolu <= 350      THEN '200_350'
    ELSE                                'gt350'
  END                                                      AS seuil_cd4
FROM patients p
JOIN vih v ON v.patient_id = p.id
LEFT JOIN premier_cd4 pc ON pc.patient_id = p.id
WHERE v.date_vih_positif IS NOT NULL;

CREATE UNIQUE INDEX idx_mv_diagnostic_tardif_pid
  ON mv_diagnostic_tardif (patient_id);