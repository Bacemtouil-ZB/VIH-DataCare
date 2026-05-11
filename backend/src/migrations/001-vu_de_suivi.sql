
CREATE OR REPLACE VIEW vue_periodes_arv AS
WITH prescriptions_ordonnees AS (
  SELECT
    pm.patient_id,
    pm.date                          AS date_prescription,
    pm.id                            AS prescription_id,
    -- Regrouper tous les médicaments de l'ordonnance
    STRING_AGG(
      COALESCE(sm.composition, pl.medicament_nom_snapshot),
      ' + ' ORDER BY pl.id
    )                                AS nom_medicament,
    STRING_AGG(
      COALESCE(sm.code, pl.medicament_nom_snapshot),
      ' + ' ORDER BY pl.id
    )                                AS code_medicament,
    -- Pour détecter un vrai changement de protocole
    STRING_AGG(
      pl.medicament_id::TEXT,
      ',' ORDER BY pl.medicament_id
    )                                AS combo_ids,
    LAG(
      STRING_AGG(pl.medicament_id::TEXT, ',' ORDER BY pl.medicament_id)
    ) OVER (
      PARTITION BY pm.patient_id
      ORDER BY pm.date, pm.id
    )                                AS combo_precedent
  FROM prescription_medicale pm
  INNER JOIN prescription_lignes   pl ON pl.prescription_id = pm.id
  LEFT  JOIN stock_medicaments     sm ON sm.id = pl.medicament_id
  GROUP BY pm.patient_id, pm.date, pm.id
),
changements_reels AS (
  SELECT *
  FROM prescriptions_ordonnees
  WHERE
    combo_precedent IS NULL
    OR combo_ids != combo_precedent
)
SELECT
  patient_id,
  prescription_id,
  nom_medicament,
  code_medicament,
  date_prescription                  AS date_debut,
  LEAD(date_prescription) OVER (
    PARTITION BY patient_id
    ORDER BY date_prescription
  ) - INTERVAL '1 day'              AS date_fin
FROM changements_reels;


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