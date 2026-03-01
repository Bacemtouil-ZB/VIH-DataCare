CREATE TABLE antecedents (
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

-- 1 seul actif / patient (TRÈS conseillé)
CREATE UNIQUE INDEX antecedents_one_active_per_patient   -- sous table antecedent
ON antecedents(patient_id)
WHERE status = 'active';


CREATE TABLE antecedent_medical (
  id SERIAL PRIMARY KEY,

  antecedent_id INTEGER UNIQUE NOT NULL REFERENCES antecedents(id) ON DELETE CASCADE,

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