-- =========================
-- ANTECEDENTS (INTEGER)
-- =========================

CREATE TABLE IF NOT EXISTS antecedents (
  id SERIAL PRIMARY KEY,

  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,

  version_number INTEGER NOT NULL DEFAULT 1 CHECK (version_number >= 1),
  status TEXT NOT NULL CHECK (status IN ('active', 'archived')) DEFAULT 'active',

  created_by INTEGER NOT NULL REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id),
  archived_by INTEGER REFERENCES users(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

-- Un seul antecedent actif par patient (important)
CREATE UNIQUE INDEX antecedents_one_active_per_patient
ON antecedents(patient_id)
WHERE status = 'active';

-- Index utile
CREATE INDEX antecedents_patient_id_idx ON antecedents(patient_id);

-- =========================
-- 1-1 TABLES (antecedent_id UNIQUE)
-- =========================

-- Medical
CREATE TABLE antecedent_medical (
  id SERIAL PRIMARY KEY,

  antecedent_id INTEGER UNIQUE NOT NULL
    REFERENCES antecedents(id) ON DELETE CASCADE,

  diabete BOOLEAN NOT NULL DEFAULT FALSE,
  hypertension BOOLEAN NOT NULL DEFAULT FALSE,
  cardiopathies BOOLEAN NOT NULL DEFAULT FALSE,
  insuffisance_renale BOOLEAN NOT NULL DEFAULT FALSE,
  maladies_hepatiques BOOLEAN NOT NULL DEFAULT FALSE,
  asthme_bpco BOOLEAN NOT NULL DEFAULT FALSE,
  cancers BOOLEAN NOT NULL DEFAULT FALSE,
  autres TEXT,

  updated_by INTEGER REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Infectious
CREATE TABLE antecedent_infectious (
  id SERIAL PRIMARY KEY,

  antecedent_id INTEGER UNIQUE NOT NULL
    REFERENCES antecedents(id) ON DELETE CASCADE,

  tuberculose BOOLEAN NOT NULL DEFAULT FALSE,
  hepatites_virales BOOLEAN NOT NULL DEFAULT FALSE,
  syphilis BOOLEAN NOT NULL DEFAULT FALSE,
  gonococcie BOOLEAN NOT NULL DEFAULT FALSE,
  chlamydia BOOLEAN NOT NULL DEFAULT FALSE,
  pneumocystose BOOLEAN NOT NULL DEFAULT FALSE,
  toxoplasmose BOOLEAN NOT NULL DEFAULT FALSE,
  candidoses_severes BOOLEAN NOT NULL DEFAULT FALSE,
  zona_recidivant BOOLEAN NOT NULL DEFAULT FALSE,

  updated_by INTEGER REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Therapeutic
CREATE TABLE antecedent_therapeutic (
  id SERIAL PRIMARY KEY,

  antecedent_id INTEGER UNIQUE NOT NULL
    REFERENCES antecedents(id) ON DELETE CASCADE,

  medicaments_chroniques TEXT,
  automedication TEXT,
  medecines_traditionnelles TEXT,
  allergies_medicaments TEXT,

  updated_by INTEGER REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gyneco
CREATE TABLE antecedent_gyneco (
  id SERIAL PRIMARY KEY,

  antecedent_id INTEGER UNIQUE NOT NULL
    REFERENCES antecedents(id) ON DELETE CASCADE,

  gestite INTEGER CHECK (gestite >= 0),
  parite INTEGER CHECK (parite >= 0),
  avortement INTEGER CHECK (avortement >= 0),

  complications TEXT,
  suivi_gynecologique TEXT,
  depistage_cancer_col TEXT,

  updated_by INTEGER REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CHECK (
    gestite IS NULL OR
    (COALESCE(parite, 0) + COALESCE(avortement, 0)) <= gestite
  )
);

-- Family
CREATE TABLE antecedent_family (
  id SERIAL PRIMARY KEY,

  antecedent_id INTEGER UNIQUE NOT NULL
    REFERENCES antecedents(id) ON DELETE CASCADE,

  diabete BOOLEAN NOT NULL DEFAULT FALSE,
  hypertension BOOLEAN NOT NULL DEFAULT FALSE,
  cardiopathies BOOLEAN NOT NULL DEFAULT FALSE,
  insuffisance_renale BOOLEAN NOT NULL DEFAULT FALSE,
  maladies_hepatiques BOOLEAN NOT NULL DEFAULT FALSE,
  asthme_bpco BOOLEAN NOT NULL DEFAULT FALSE,
  cancers BOOLEAN NOT NULL DEFAULT FALSE,
  autres TEXT,

  updated_by INTEGER REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- 1-N TABLES
-- =========================

-- Surgical (1-N)
CREATE TABLE antecedent_surgical (
  id SERIAL PRIMARY KEY,

  antecedent_id INTEGER NOT NULL
    REFERENCES antecedents(id) ON DELETE CASCADE,

  description TEXT,
  date_intervention DATE,

  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX antecedent_surgical_antecedent_id_idx
ON antecedent_surgical(antecedent_id);

-- Transfusion (1-N)
CREATE TABLE antecedent_transfusion (
  id SERIAL PRIMARY KEY,

  antecedent_id INTEGER NOT NULL
    REFERENCES antecedents(id) ON DELETE CASCADE,

  date_transfusion DATE,

  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX antecedent_transfusion_antecedent_id_idx
ON antecedent_transfusion(antecedent_id);

-- AES (1-N)
CREATE TABLE antecedent_aes (
  id SERIAL PRIMARY KEY,

  antecedent_id INTEGER NOT NULL
    REFERENCES antecedents(id) ON DELETE CASCADE,

  date_aes DATE,

  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX antecedent_aes_antecedent_id_idx
ON antecedent_aes(antecedent_id);