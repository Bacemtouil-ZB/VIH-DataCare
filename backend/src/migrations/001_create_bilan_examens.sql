-- ── Table bilan_examens ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bilan_examens (
  id            SERIAL PRIMARY KEY,
  patient_id    INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  
  bilan_initial_complet   BOOLEAN DEFAULT FALSE,
  serologie_vih           BOOLEAN DEFAULT FALSE,
  bilan_biochimique       BOOLEAN DEFAULT FALSE,
  serologie_vhb           BOOLEAN DEFAULT FALSE,
  nfs_complete            BOOLEAN DEFAULT FALSE,
  charge_virale_vih       BOOLEAN DEFAULT FALSE,
  cd4_cd8                 BOOLEAN DEFAULT FALSE,
  bilan_lipidique         BOOLEAN DEFAULT FALSE,
  serologie_vha           BOOLEAN DEFAULT FALSE,
  serologie_vhc           BOOLEAN DEFAULT FALSE,
  serologie_syphilis      BOOLEAN DEFAULT FALSE,  
  serologie_toxoplasmose  BOOLEAN DEFAULT FALSE,
  serologie_cmv           BOOLEAN DEFAULT FALSE,
  serologie_leishmaniose  BOOLEAN DEFAULT FALSE,
  idr_tuberculine         BOOLEAN DEFAULT FALSE,
  test_genotypage         BOOLEAN DEFAULT FALSE,
  radio_thorax            BOOLEAN DEFAULT FALSE,

  observations            TEXT,

  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Enum audit (à ajouter si pas encore présent)
ALTER TYPE action_enum ADD VALUE IF NOT EXISTS 'BILAN_EXAMEN_CREATE';
ALTER TYPE action_enum ADD VALUE IF NOT EXISTS 'BILAN_EXAMEN_VIEW';
ALTER TYPE action_enum ADD VALUE IF NOT EXISTS 'BILAN_EXAMEN_UPDATE';