-- -- ── ÉTAPE 1 : Périodes ARV réelles (inchangée) ──────────────────────────────
 
-- CREATE OR REPLACE VIEW vue_periodes_arv AS
-- WITH prescriptions_ordonnees AS (
--   SELECT
--     pm.patient_id,
--     pm.date                          AS date_prescription,
--     pm.medicament_id,
--     sm.composition                   AS nom_medicament,
--     sm.code                          AS code_medicament,
--     LAG(pm.medicament_id) OVER (
--       PARTITION BY pm.patient_id
--       ORDER BY pm.date, pm.id
--     )                                AS medicament_precedent
--   FROM prescription_medicale pm
--   LEFT JOIN stock_medicaments sm ON sm.id = pm.medicament_id
-- ),
-- changements_reels AS (
--   SELECT *
--   FROM prescriptions_ordonnees
--   WHERE
--     medicament_precedent IS NULL
--     OR medicament_id != medicament_precedent
-- )
-- SELECT
--   patient_id,
--   medicament_id,
--   nom_medicament,
--   code_medicament,
--   date_prescription                  AS date_debut,
--   LEAD(date_prescription) OVER (
--     PARTITION BY patient_id
--     ORDER BY date_prescription
--   ) - INTERVAL '1 day'              AS date_fin
-- FROM changements_reels;
 
 
-- -- ── ÉTAPE 2 : Points CD4 (une ligne par mesure CD4) ─────────────────────────
 
-- CREATE OR REPLACE VIEW vue_points_cd4 AS
-- SELECT
--   rb.id                              AS resultat_id,
--   rb.patient_id,
--   rb.date_cd4_cd8                    AS date_point,
--   rb.cd4_absolu,
--   rb.cd4_pourcent,
 
--   -- traitement actif à la date du CD4
--   arv.nom_medicament                 AS traitement,
--   arv.code_medicament                AS traitement_code,
--   arv.date_debut                     AS traitement_date_debut,
--   arv.date_fin                       AS traitement_date_fin
 
-- FROM resultats_biologiques rb
-- LEFT JOIN vue_periodes_arv arv
--   ON  arv.patient_id = rb.patient_id
--   AND rb.date_cd4_cd8 >= arv.date_debut
--   AND (
--     arv.date_fin IS NULL
--     OR rb.date_cd4_cd8 <= arv.date_fin
--   )
-- WHERE rb.date_cd4_cd8 IS NOT NULL
--   AND rb.cd4_absolu   IS NOT NULL
-- ORDER BY rb.patient_id, rb.date_cd4_cd8 ASC;
 
 
-- -- ── ÉTAPE 3 : Points CV (une ligne par mesure charge virale) ────────────────
 
-- CREATE OR REPLACE VIEW vue_points_cv AS
-- SELECT
--   rb.id                              AS resultat_id,
--   rb.patient_id,
--   rb.date_charge_virale_vih          AS date_point,
--   rb.charge_virale_valeur,
 
--   -- traitement actif à la date de la CV
--   arv.nom_medicament                 AS traitement,
--   arv.code_medicament                AS traitement_code,
--   arv.date_debut                     AS traitement_date_debut,
--   arv.date_fin                       AS traitement_date_fin
 
-- FROM resultats_biologiques rb
-- LEFT JOIN vue_periodes_arv arv
--   ON  arv.patient_id = rb.patient_id
--   AND rb.date_charge_virale_vih >= arv.date_debut
--   AND (
--     arv.date_fin IS NULL
--     OR rb.date_charge_virale_vih <= arv.date_fin
--   )
-- WHERE rb.date_charge_virale_vih   IS NOT NULL
--   AND rb.charge_virale_valeur     IS NOT NULL
-- ORDER BY rb.patient_id, rb.date_charge_virale_vih ASC;
 
 
-- -- ── ÉTAPE 4 : VIEW principale — tableau Zone 3 ──────────────────────────────
-- --
-- -- Une ligne = une entrée resultats_biologiques
-- -- Affiche les deux dates séparément
-- -- date_tri = pour ORDER BY uniquement (pas pour les graphiques)
 
-- CREATE OR REPLACE VIEW vue_suivi_patient AS
-- SELECT
--   rb.id,
--   rb.patient_id,
--   rb.bilan_id,
 
--   -- ── dates séparées (correctes depuis labo) ───────────────────────────
--   rb.date_cd4_cd8                    AS date_cd4,
--   rb.date_charge_virale_vih          AS date_cv,
 
--   -- date de tri uniquement (pas affichée comme date de résultat)
--   COALESCE(
--     rb.date_cd4_cd8,
--     rb.date_charge_virale_vih
--   )                                  AS date_tri,
 
--   -- ── biologie clé ─────────────────────────────────────────────────────
--   rb.cd4_absolu,
--   rb.cd4_pourcent,
--   rb.charge_virale_valeur,
--   rb.hemoglobine,
--   rb.plaquettes,
--   rb.globules_blancs,
--   rb.lymphocytes,
 
--   -- ── type bilan ───────────────────────────────────────────────────────
--   CASE
--     WHEN be.bilan_initial_complet = TRUE THEN 'Initial'
--     ELSE 'Suivi'
--   END                                AS type_bilan,
 
--   -- ── traitement actif (basé sur date_tri) ─────────────────────────────
--   arv.nom_medicament                 AS traitement,
--   arv.code_medicament                AS traitement_code,
--   arv.date_debut                     AS traitement_date_debut,
--   arv.date_fin                       AS traitement_date_fin,
 
--   -- ── statut automatique ────────────────────────────────────────────────
--   CASE
--     WHEN rb.cd4_absolu < 200
--          OR rb.charge_virale_valeur > 1000  THEN 'Critique'
--     WHEN rb.cd4_absolu BETWEEN 200 AND 500  THEN 'Moyen'
--     WHEN rb.cd4_absolu > 500               THEN 'Bon'
--     ELSE                                        'Inconnu'
--   END                                AS statut,
 
--   rb.observations
 
-- FROM resultats_biologiques rb
-- LEFT JOIN bilan_examens be
--   ON be.id = rb.bilan_id
-- LEFT JOIN vue_periodes_arv arv
--   ON  arv.patient_id = rb.patient_id
--   AND COALESCE(rb.date_cd4_cd8, rb.date_charge_virale_vih) >= arv.date_debut
--   AND (
--     arv.date_fin IS NULL
--     OR COALESCE(rb.date_cd4_cd8, rb.date_charge_virale_vih) <= arv.date_fin
--   )
-- ORDER BY date_tri DESC;

-- 
-- ══════════════════════════════════════════════════════════════════════════════
-- VUE 1 : vue_periodes_arv (inchangée ✅)
-- ══════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW vue_periodes_arv AS
WITH prescriptions_ordonnees AS (
  SELECT
    pm.patient_id,
    pm.date                          AS date_prescription,
    pm.medicament_id,
    sm.composition                   AS nom_medicament,
    sm.code                          AS code_medicament,
    LAG(pm.medicament_id) OVER (
      PARTITION BY pm.patient_id
      ORDER BY pm.date, pm.id
    )                                AS medicament_precedent
  FROM prescription_medicale pm
  LEFT JOIN stock_medicaments sm ON sm.id = pm.medicament_id
),
changements_reels AS (
  SELECT *
  FROM prescriptions_ordonnees
  WHERE
    medicament_precedent IS NULL
    OR medicament_id != medicament_precedent
)
SELECT
  patient_id,
  medicament_id,
  nom_medicament,
  code_medicament,
  date_prescription                  AS date_debut,
  LEAD(date_prescription) OVER (
    PARTITION BY patient_id
    ORDER BY date_prescription
  ) - INTERVAL '1 day'              AS date_fin
FROM changements_reels;


-- ══════════════════════════════════════════════════════════════════════════════
-- VUE 2 : vue_points_cd4 (améliorée ✅)
-- ══════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW vue_points_cd4 AS
SELECT
  rb.id                              AS resultat_id,
  rb.patient_id,
  rb.bilan_id,
  rb.date_cd4_cd8                    AS date_point,
  rb.cd4_absolu,
  rb.cd4_pourcent,

  -- type bilan
  CASE
    WHEN be.bilan_initial_complet = TRUE THEN 'Initial'
    ELSE 'Contrôle'
  END                                AS type_bilan,

  -- traitement actif à la date du CD4
  COALESCE(
    arv.nom_medicament,
    'Pas encore de traitement'
  )                                  AS traitement,
  COALESCE(
    arv.code_medicament,
    'N/A'
  )                                  AS traitement_code,
  arv.date_debut                     AS traitement_date_debut,
  arv.date_fin                       AS traitement_date_fin

FROM resultats_biologiques rb
LEFT JOIN bilan_examens be
  ON be.id = rb.bilan_id
LEFT JOIN vue_periodes_arv arv
  ON  arv.patient_id = rb.patient_id
  AND rb.date_cd4_cd8 >= arv.date_debut
  AND (
    arv.date_fin IS NULL
    OR rb.date_cd4_cd8 <= arv.date_fin
  )
WHERE rb.date_cd4_cd8 IS NOT NULL
  AND rb.cd4_absolu   IS NOT NULL
ORDER BY rb.patient_id, rb.date_cd4_cd8 ASC;


-- ══════════════════════════════════════════════════════════════════════════════
-- VUE 3 : vue_points_cv (améliorée ✅)
-- ══════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW vue_points_cv AS
SELECT
  rb.id                              AS resultat_id,
  rb.patient_id,
  rb.bilan_id,
  rb.date_charge_virale_vih          AS date_point,
  rb.charge_virale_valeur,

  -- type bilan
  CASE
    WHEN be.bilan_initial_complet = TRUE THEN 'Initial'
    ELSE 'Contrôle'
  END                                AS type_bilan,

  -- traitement actif à la date de la CV
  COALESCE(
    arv.nom_medicament,
    'Pas encore de traitement'
  )                                  AS traitement,
  COALESCE(
    arv.code_medicament,
    'N/A'
  )                                  AS traitement_code,
  arv.date_debut                     AS traitement_date_debut,
  arv.date_fin                       AS traitement_date_fin

FROM resultats_biologiques rb
LEFT JOIN bilan_examens be
  ON be.id = rb.bilan_id
LEFT JOIN vue_periodes_arv arv
  ON  arv.patient_id = rb.patient_id
  AND rb.date_charge_virale_vih >= arv.date_debut
  AND (
    arv.date_fin IS NULL
    OR rb.date_charge_virale_vih <= arv.date_fin
  )
WHERE rb.date_charge_virale_vih   IS NOT NULL
  AND rb.charge_virale_valeur     IS NOT NULL
ORDER BY rb.patient_id, rb.date_charge_virale_vih ASC;


-- ══════════════════════════════════════════════════════════════════════════════
-- VUE 4 : vue_suivi_patient (améliorée ✅ statut retiré)
-- ══════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW vue_suivi_patient AS
SELECT
  rb.id,
  rb.patient_id,
  rb.bilan_id,

  -- ── dates séparées ────────────────────────────────────────────────────
  rb.date_cd4_cd8                    AS date_cd4,
  rb.date_charge_virale_vih          AS date_cv,
  rb.date_bilan_biochimique,
  rb.date_nfs_complete,
  rb.date_bilan_lipidique,
  rb.date_serologie_vhb,
  rb.date_serologie_vhc,
  rb.date_serologie_vha,
  rb.date_serologie_toxoplasmose,
  rb.date_serologie_cmv,

  -- date tri uniquement
  COALESCE(
    rb.date_cd4_cd8,
    rb.date_charge_virale_vih
  )                                  AS date_tri,

  -- ── biologie clé ─────────────────────────────────────────────────────
  rb.cd4_absolu,
  rb.cd4_pourcent,
  rb.charge_virale_valeur,
  rb.plaquettes,
  rb.globules_blancs,
  rb.lymphocytes,

  -- ── bilan biochimique ────────────────────────────────────────────────
  rb.asat,
  rb.alat,
  rb.creatinine,
  rb.phosphore,
  rb.calcemie,

  -- ── bilan lipidique ──────────────────────────────────────────────────
  rb.cholesterol_total,
  rb.hdl,
  rb.ldl,
  rb.triglycerides,

  -- ── sérologie VHB ────────────────────────────────────────────────────
  rb.vhb_ag_hbs,
  rb.vhb_ac_hbs,
  rb.vhb_ac_hbc,

  -- ── sérologie VHC ────────────────────────────────────────────────────
  rb.vhc,

  -- ── sérologie VHA ────────────────────────────────────────────────────
  rb.vha_igg,

  -- ── Toxoplasmose ─────────────────────────────────────────────────────
  rb.toxo_igg,
  rb.toxo_igm,

  -- ── CMV ──────────────────────────────────────────────────────────────
  rb.cmv_igg,
  rb.cmv_igm,

  -- ── sérologie syphilis ───────────────────────────────────────────────
  rb.vdrl,
  rb.tpha,

  -- ── leishmaniose + IDR ───────────────────────────────────────────────
  rb.leishmania_ac,
  rb.idr_tuberculine,

  -- ── type bilan ───────────────────────────────────────────────────────
  CASE
    WHEN be.bilan_initial_complet = TRUE THEN 'Initial'
    ELSE 'Contrôle'
  END                                AS type_bilan,

  -- ── traitement actif ─────────────────────────────────────────────────
  COALESCE(
    arv.nom_medicament,
    'Pas encore de traitement'
  )                                  AS traitement,
  COALESCE(
    arv.code_medicament,
    'N/A'
  )                                  AS traitement_code,
  arv.date_debut                     AS traitement_date_debut,
  arv.date_fin                       AS traitement_date_fin,

  -- ── statut retiré ✅ → calculé dans le backend ────────────────────────

  rb.observations

FROM resultats_biologiques rb
LEFT JOIN bilan_examens be
  ON be.id = rb.bilan_id
LEFT JOIN vue_periodes_arv arv
  ON  arv.patient_id = rb.patient_id
  AND COALESCE(rb.date_cd4_cd8, rb.date_charge_virale_vih) >= arv.date_debut
  AND (
    arv.date_fin IS NULL
    OR COALESCE(rb.date_cd4_cd8, rb.date_charge_virale_vih) <= arv.date_fin
  )
ORDER BY date_tri DESC;