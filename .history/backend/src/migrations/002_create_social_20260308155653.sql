CREATE TABLE social (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,

  situation_social situation_social_enum,
  niveau_etude niveau_etude_enum,
  nombre_enfants INTEGER DEFAULT 0,
  type_ressource type_ressource_enum,
  activite_professionnelle activite_professionnelle_enum,
  probleme probleme_enum[],
  remarque TEXT,

  created_by INTEGER REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_patient_social UNIQUE (patient_id)
);

-- CREATE TYPE niveau_etude_enum AS ENUM (
--   'sans_instruction',
--   'primaire',
--   'secondaire',
--   'formation_professionnelle',
--   'baccalaureat',
--   'licence',
--   'master',
--   'doctorat'
-- );
--changer par
CREATE TYPE niveau_etude_enum AS ENUM (
  'sans_instruction',
  'primaire',
  'secondaire',
  'universite'
);


-- CREATE TYPE activite_professionnelle_enum AS ENUM (
--   'etudiant',
--   'salarie_public',
--   'salarie_prive',
--   'travailleur_independant',
--   'profession_liberale',
--   'artisan',
--   'commercant',
--   'agriculteur',
--   'sans_emploi',
--   'retraite',
--   'personne_au_foyer'
-- );
--changer par
CREATE TYPE activite_professionnelle_enum AS ENUM (
  'etudiant',
  'salarie',
  'sans_emploi',
  'retraite',
  'personne_au_foyer'
);

CREATE TYPE situation_social_enum AS ENUM (
  'celibataire',
  'marie',
  'divorce',
  'veuf',
  'autre'
);

CREATE TYPE probleme_enum AS ENUM (
  'precarite_logement',
  'instabilite_professionnelle',
  'difficultes_financieres',
  'conflits_familiaux',
  'isolement_social',
  'violence_domestique',
  'problemes_transport',
  'difficulte_acces_soins'
);