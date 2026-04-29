CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,

  numero VARCHAR(100) UNIQUE NOT NULL,

  name VARCHAR(100) NOT NULL,
  surname VARCHAR(100) NOT NULL,
  birthdate DATE NOT NULL,

  gender VARCHAR(20)
      CHECK (gender IN ('homme', 'femme', 'transgenre')),

  birth_address_id INTEGER
      REFERENCES addresses(id),

  residence_address_id INTEGER
      REFERENCES addresses(id),

  phone VARCHAR(20) NOT NULL,

  hospitalisation VARCHAR(20) NOT NULL
      CHECK (hospitalisation IN ('interne', 'externe')),

  status VARCHAR(100),

  remarks TEXT,

  doctor_id INTEGER
      REFERENCES users(id)
      ON DELETE SET NULL,

  created_by INTEGER REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

--for mobile app 
ALTER TYPE role_enum ADD VALUE 'patient';
ALTER TABLE patients 
ADD COLUMN user_id INTEGER UNIQUE REFERENCES users(id);

ALTER TABLE patients
ADD COLUMN email VARCHAR(255),
ADD COLUMN whatsapp VARCHAR(20);



-- update 19/04/2026
-- 1. Corriger les valeurs NULL existantes
UPDATE public.patients
  SET status = 'en_attente'
  WHERE status IS NULL;

-- 2. Modifier le champ status
ALTER TABLE public.patients
  ALTER COLUMN status SET NOT NULL,
  ALTER COLUMN status SET DEFAULT 'en_attente',
  ADD CONSTRAINT patients_status_check
    CHECK (status::text = ANY (ARRAY[
      'en_attente'::character varying,
      'actif'::character varying,
      'en_retard'::character varying,
      'perdu_de_vue'::character varying,
      'decede'::character varying,
      'decede_sida'::character varying,
      'transfere'::character varying,
      'migrant'::character varying
    ]::text[]));

---- 21/04/2026
ALTER TABLE patients DROP CONSTRAINT patients_status_check;

ALTER TABLE patients ADD CONSTRAINT patients_status_check 
CHECK (
  status IS NULL OR
  TRIM(status) = ANY (ARRAY[
    'standard', 'standard_inactif',
    'migrant', 'migrant_inactif',
    'decede', 'decede_sida', 'transfere'
  ])
);