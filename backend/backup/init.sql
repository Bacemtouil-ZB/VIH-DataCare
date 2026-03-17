-- ==========================================
-- SUPPRESSION ET RECRÉATION COMPLÈTE
-- ==========================================

DROP TABLE IF EXISTS autres_signes_cliniques CASCADE;
DROP TABLE IF EXISTS autres_signes_fonctionnels CASCADE;
DROP TABLE IF EXISTS signes_cliniques CASCADE;
DROP TABLE IF EXISTS signes_fonctionnels CASCADE;
DROP TABLE IF EXISTS habitudes_vie CASCADE;
DROP TABLE IF EXISTS observations CASCADE;
DROP TABLE IF EXISTS examen_clinique CASCADE;
DROP TABLE IF EXISTS prescription_medicale CASCADE;
DROP TABLE IF EXISTS password_resets CASCADE;
DROP TABLE IF EXISTS doctor_conclusions CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS rendezvous CASCADE;
DROP TABLE IF EXISTS ordonnances CASCADE;
DROP TABLE IF EXISTS antecedent_aes CASCADE;
DROP TABLE IF EXISTS antecedent_transfusion CASCADE;
DROP TABLE IF EXISTS antecedent_surgical CASCADE;
DROP TABLE IF EXISTS antecedent_family CASCADE;
DROP TABLE IF EXISTS antecedent_gyneco CASCADE;
DROP TABLE IF EXISTS antecedent_therapeutic CASCADE;
DROP TABLE IF EXISTS antecedent_infectious CASCADE;
DROP TABLE IF EXISTS antecedent_medical CASCADE;
DROP TABLE IF EXISTS antecedents CASCADE;
DROP TABLE IF EXISTS vih CASCADE;
DROP TABLE IF EXISTS social CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS stock_medicaments CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS postal_codes CASCADE;
DROP TABLE IF EXISTS governorates CASCADE;
DROP TABLE IF EXISTS ref_appareil_fonctionnel CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS migrations CASCADE;

DROP TYPE IF EXISTS action_enum CASCADE;
DROP TYPE IF EXISTS role_enum CASCADE;
DROP TYPE IF EXISTS niveau_etude_enum CASCADE;
DROP TYPE IF EXISTS activite_professionnelle_enum CASCADE;
DROP TYPE IF EXISTS situation_social_enum CASCADE;
DROP TYPE IF EXISTS type_ressource_enum CASCADE;
DROP TYPE IF EXISTS probleme_enum CASCADE;

-- ==========================================
-- TYPES ENUM
-- ==========================================

CREATE TYPE role_enum AS ENUM ('admin', 'pharmacien', 'medecin', 'analyste');

CREATE TYPE niveau_etude_enum AS ENUM (
  'sans_instruction', 'primaire', 'secondaire', 'universite'
);

CREATE TYPE activite_professionnelle_enum AS ENUM (
  'etudiant', 'salarie', 'sans_emploi', 'retraite', 'personne_au_foyer'
);

CREATE TYPE situation_social_enum AS ENUM (
  'celibataire', 'marie', 'divorce', 'veuf', 'autre'
);

CREATE TYPE type_ressource_enum AS ENUM (
  'salaire', 'allocation', 'pension', 'aide_familiale', 'autre'
);

CREATE TYPE probleme_enum AS ENUM (
  'precarite_logement', 'instabilite_professionnelle', 'difficultes_financieres',
  'conflits_familiaux', 'isolement_social', 'violence_domestique',
  'problemes_transport', 'difficulte_acces_soins'
);

CREATE TYPE action_enum AS ENUM (
  'LOGIN_SUCCESS', 'LOGIN_FAILED',
  'PATIENT_CREATE', 'PATIENT_UPDATE', 'PATIENT_VIEW',
  'SOCIAL_CREATE', 'SOCIAL_UPDATE', 'SOCIAL_VIEW',
  'VIH_CREATE', 'VIH_UPDATE', 'VIH_VIEW',
  'EXAMEN_CLINIQUE_CREATE', 'EXAMEN_CLINIQUE_UPDATE', 'EXAMEN_CLINIQUE_VIEW',
  'OBSERVATION_CREATE', 'OBSERVATION_UPDATE', 'OBSERVATION_VIEW',
  'HABITUDE_DE_VIE_CREATE', 'HABITUDE_DE_VIE_UPDATE', 'HABITUDE_DE_VIE_VIEW',
  'SIGNE_CLINIQUE_VIEW', 'SIGNE_CLINIQUE_UPDATE', 'SIGNE_CLINIQUE_CREATE',
  'SIGNE_FONCTIONNEL_VIEW', 'SIGNE_FONCTIONNEL_UPDATE', 'SIGNE_FONCTIONNEL_CREATE',
  'STOCK_CREATE', 'STOCK_UPDATE', 'STOCK_VIEW', 'STOCK_DELETE',
  'RENDEZ_VOUS_CREATE', 'RENDEZ_VOUS_UPDATE', 'RENDEZ_VOUS_VIEW',
  'PRESCRIPTION_MEDICALE_CREATE', 'PRESCRIPTION_MEDICALE_VIEW', 'PRESCRIPTION_MEDICALE_UPDATE'
);

-- ==========================================
-- FONCTIONS
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- TABLES DE BASE
-- ==========================================

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(50) NOT NULL,
  prenom VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role role_enum,
  isactivated BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE governorates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE postal_codes (
  id SERIAL PRIMARY KEY,
  governorate_id INTEGER NOT NULL REFERENCES governorates(id) ON DELETE CASCADE,
  code CHAR(4) NOT NULL UNIQUE,
  place_name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  rue VARCHAR(255),
  postal_code_id INTEGER REFERENCES postal_codes(id),
  complement_adresse TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE stock_medicaments (
  id SERIAL PRIMARY KEY,
  code VARCHAR(30) NOT NULL UNIQUE,
  composition VARCHAR(255) NOT NULL,
  dosage VARCHAR(200),
  quantite INTEGER NOT NULL DEFAULT 0 CHECK (quantite >= 0),
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  numero VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  surname VARCHAR(100) NOT NULL,
  birthdate DATE NOT NULL,
  gender VARCHAR(20) CHECK (gender IN ('homme', 'femme')),
  birth_address_id INTEGER REFERENCES addresses(id),
  residence_address_id INTEGER REFERENCES addresses(id),
  phone VARCHAR(20) NOT NULL,
  hospitalisation VARCHAR(20) NOT NULL CHECK (hospitalisation IN ('interne', 'externe')),
  status VARCHAR(100),
  remarks TEXT,
  doctor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_by INTEGER REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

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

CREATE TABLE vih (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  mode_contamination VARCHAR(500),
  type_depistage VARCHAR(20),
  circonstance_decouverte VARCHAR(100),
  date_derniere_negative DATE,
  date_contamination DATE,
  date_vih_positif DATE,
  stade_cdc VARCHAR(10),
  debut_stade_c DATE,
  profil_seroconversion BOOLEAN DEFAULT FALSE,
  typage_hla_b5701 VARCHAR(10),
  created_by INTEGER REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_patient_vih UNIQUE(patient_id)
);

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

CREATE UNIQUE INDEX antecedents_one_active_per_patient
ON antecedents(patient_id) WHERE status = 'active';

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

CREATE TABLE antecedent_infectious (
  id SERIAL PRIMARY KEY,
  antecedent_id INTEGER UNIQUE NOT NULL REFERENCES antecedents(id) ON DELETE CASCADE,
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

CREATE TABLE antecedent_therapeutic (
  id SERIAL PRIMARY KEY,
  antecedent_id INTEGER UNIQUE NOT NULL REFERENCES antecedents(id) ON DELETE CASCADE,
  medicaments_chroniques TEXT,
  automedication TEXT,
  medecines_traditionnelles TEXT,
  allergies_medicaments TEXT,
  updated_by INTEGER REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE antecedent_gyneco (
  id SERIAL PRIMARY KEY,
  antecedent_id INTEGER UNIQUE NOT NULL REFERENCES antecedents(id) ON DELETE CASCADE,
  gestite INTEGER CHECK (gestite >= 0),
  parite INTEGER CHECK (parite >= 0),
  avortement INTEGER CHECK (avortement >= 0),
  complications TEXT,
  suivi_gynecologique TEXT,
  depistage_cancer_col TEXT,
  updated_by INTEGER REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (gestite IS NULL OR (COALESCE(parite, 0) + COALESCE(avortement, 0)) <= gestite)
);

CREATE TABLE antecedent_family (
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

CREATE TABLE antecedent_surgical (
  id SERIAL PRIMARY KEY,
  antecedent_id INTEGER NOT NULL REFERENCES antecedents(id) ON DELETE CASCADE,
  description TEXT,
  date_intervention DATE,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE antecedent_transfusion (
  id SERIAL PRIMARY KEY,
  antecedent_id INTEGER NOT NULL REFERENCES antecedents(id) ON DELETE CASCADE,
  date_transfusion DATE,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE antecedent_aes (
  id SERIAL PRIMARY KEY,
  antecedent_id INTEGER NOT NULL REFERENCES antecedents(id) ON DELETE CASCADE,
  date_aes DATE,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ordonnances (
  id SERIAL PRIMARY KEY,
  nom_traitement VARCHAR(500) NOT NULL,
  quantite_prescrite INTEGER NOT NULL CHECK (quantite_prescrite > 0),
  date_prescription DATE NOT NULL DEFAULT CURRENT_DATE,
  date_debut_traitement DATE NOT NULL,
  date_prochaine_prise DATE,
  duree_perte_de_vue INTEGER,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  medecin_id INTEGER NOT NULL REFERENCES users(id),
  statut VARCHAR(50) NOT NULL DEFAULT 'en cours de suivi' 
    CHECK (statut IN ('en cours de suivi', 'perdu de vue', 'en fin de suivi','decedé')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rendezvous (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  heure TIME NOT NULL,
  type VARCHAR(255) NOT NULL,
  commentaire TEXT,
  statut VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ref_appareil_fonctionnel (
  id SERIAL PRIMARY KEY,
  libelle VARCHAR(100) NOT NULL,
  ordre INTEGER NOT NULL
);

CREATE TABLE examen_clinique (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  date_examen TIMESTAMP NOT NULL,
  medecin_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE signes_fonctionnels (
  id SERIAL PRIMARY KEY,
  examen_clinique_id INTEGER NOT NULL REFERENCES examen_clinique(id) ON DELETE CASCADE,
  fievre BOOLEAN DEFAULT FALSE,
  toux BOOLEAN DEFAULT FALSE,
  dyspnee BOOLEAN DEFAULT FALSE,
  sueurs_nocturnes BOOLEAN DEFAULT FALSE,
  cephalee BOOLEAN DEFAULT FALSE,
  rhinorrhee BOOLEAN DEFAULT FALSE,
  troubles_visuels BOOLEAN DEFAULT FALSE,
  diarrhee BOOLEAN DEFAULT FALSE,
  douleurs_abdomen BOOLEAN DEFAULT FALSE,
  nausees BOOLEAN DEFAULT FALSE,
  dysphagie BOOLEAN DEFAULT FALSE,
  prurit BOOLEAN DEFAULT FALSE,
  paresthesie BOOLEAN DEFAULT FALSE,
  myalgie BOOLEAN DEFAULT FALSE,
  arthralgie BOOLEAN DEFAULT FALSE,
  anorexie BOOLEAN DEFAULT FALSE,
  insomnie BOOLEAN DEFAULT FALSE,
  troubles_humeur BOOLEAN DEFAULT FALSE,
  asthenie BOOLEAN DEFAULT FALSE,
  crampes BOOLEAN DEFAULT FALSE,
  troubles_libido BOOLEAN DEFAULT FALSE,
  ras BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE autres_signes_fonctionnels (
  id SERIAL PRIMARY KEY,
  signes_fonctionnels_id INTEGER NOT NULL REFERENCES signes_fonctionnels(id) ON DELETE CASCADE,
  appareil_id INTEGER NOT NULL REFERENCES ref_appareil_fonctionnel(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE signes_cliniques (
  id SERIAL PRIMARY KEY,
  examen_clinique_id INTEGER NOT NULL REFERENCES examen_clinique(id) ON DELETE CASCADE,
  poids DECIMAL(5,2),
  taille DECIMAL(5,2),
  imc DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE autres_signes_cliniques (
  id SERIAL PRIMARY KEY,
  signes_cliniques_id INTEGER NOT NULL REFERENCES signes_cliniques(id) ON DELETE CASCADE,
  appareil_id INTEGER NOT NULL REFERENCES ref_appareil_fonctionnel(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE habitudes_vie (
  id SERIAL PRIMARY KEY,
  examen_clinique_id INTEGER NOT NULL REFERENCES examen_clinique(id) ON DELETE CASCADE,
  tabagisme BOOLEAN DEFAULT FALSE NOT NULL,
  alcoolemie BOOLEAN DEFAULT FALSE NOT NULL,
  toxicomanie BOOLEAN DEFAULT FALSE NOT NULL,
  activite_physique BOOLEAN DEFAULT FALSE NOT NULL,
  created_by INTEGER REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_habitude_examen UNIQUE(examen_clinique_id)
);

CREATE TABLE observations (
  id SERIAL PRIMARY KEY,
  examen_clinique_id INTEGER NOT NULL REFERENCES examen_clinique(id) ON DELETE CASCADE,
  remarque TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE prescription_medicale (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  medicament_id INTEGER REFERENCES stock_medicaments(id) ON DELETE SET NULL,
  traitement VARCHAR(255) NOT NULL,
  posologie VARCHAR(255) NOT NULL,
  dosage VARCHAR(255),
  date DATE NOT NULL,
  quantite INTEGER NOT NULL CHECK (quantite > 0),
  remarque TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_resets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE doctor_conclusions (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  request_id UUID,
  session_id VARCHAR(255),
  user_id INTEGER REFERENCES users(id),
  user_role role_enum,
  patient_id INTEGER REFERENCES patients(id) ON DELETE SET NULL,
  module VARCHAR(50),
  action action_enum NOT NULL,
  entity_id INTEGER,
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(100),
  user_agent TEXT,
  is_anomaly BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- INDEX
-- ==========================================

CREATE INDEX idx_postal_codes_code ON postal_codes(code);
CREATE INDEX idx_postal_codes_governorate ON postal_codes(governorate_id);
CREATE INDEX idx_addresses_postal_code ON addresses(postal_code_id);
CREATE INDEX idx_stock_medicaments_code ON stock_medicaments(code);
CREATE INDEX idx_vih_patient_id ON vih(patient_id);
CREATE INDEX idx_antecedents_patient_id ON antecedents(patient_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_patient ON audit_logs(patient_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_date ON audit_logs(created_at);
CREATE INDEX idx_doctor_conclusions_patient_created ON doctor_conclusions (patient_id, created_at DESC);
CREATE INDEX idx_doctor_conclusions_doctor_created ON doctor_conclusions (doctor_id, created_at DESC);

-- ==========================================
-- DONNÉES INITIALES
-- ==========================================

-- Gouvernorats
INSERT INTO governorates (name) VALUES
  ('Tunis'), ('Ariana'), ('Ben Arous'), ('Manouba'),
  ('Nabeul'), ('Zaghouan'), ('Bizerte'), ('Béja'),
  ('Jendouba'), ('Kef'), ('Siliana'), ('Kairouan'),
  ('Kasserine'), ('Sidi Bouzid'), ('Sousse'), ('Monastir'),
  ('Mahdia'), ('Sfax'), ('Gafsa'), ('Tozeur'),
  ('Kebili'), ('Gabès'), ('Medenine'), ('Tataouine');

-- Codes Postaux avec JSON
WITH raw AS (
  SELECT $$[
    {
      "Name": "Tunis",
      "Delegations": [
        {"Name": "Tunis", "PostalCode": "1000", "Latitude": 36.8065, "Longitude": 10.1815},
        {"Name": "Carthage", "PostalCode": "2016", "Latitude": 36.8531, "Longitude": 10.3233},
        {"Name": "Le Bardo", "PostalCode": "2000", "Latitude": 36.8089, "Longitude": 10.1403},
        {"Name": "La Marsa", "PostalCode": "2070", "Latitude": 36.8787, "Longitude": 10.3250}
      ]
    },
    {
      "Name": "Ariana",
      "Delegations": [
        {"Name": "Ariana", "PostalCode": "2080", "Latitude": 36.8625, "Longitude": 10.1956},
        {"Name": "La Soukra", "PostalCode": "2036", "Latitude": 36.8514, "Longitude": 10.2139},
        {"Name": "Raoued", "PostalCode": "2058", "Latitude": 36.8989, "Longitude": 10.1867}
      ]
    },
    {
      "Name": "Ben Arous",
      "Delegations": [
        {"Name": "Ben Arous", "PostalCode": "2013", "Latitude": 36.7472, "Longitude": 10.2194},
        {"Name": "Ezzahra", "PostalCode": "2034", "Latitude": 36.7494, "Longitude": 10.3281},
        {"Name": "Hammam-Lif", "PostalCode": "2050", "Latitude": 36.7289, "Longitude": 10.3403}
      ]
    }
  ]$$::jsonb AS j
),
gov_map AS (
  SELECT id, upper(trim(name)) AS gov_name_norm
  FROM governorates
),
flat AS (
  SELECT
    upper(trim(gov->>'Name')) AS gov_name_norm,
    trim(del->>'Name') AS place_name,
    lpad(regexp_replace(trim(del->>'PostalCode'), '\D', '', 'g'), 4, '0') AS code,
    (del->>'Latitude')::DECIMAL(10,8) AS latitude,
    (del->>'Longitude')::DECIMAL(11,8) AS longitude
  FROM raw
  CROSS JOIN LATERAL jsonb_array_elements(j) AS gov
  CROSS JOIN LATERAL jsonb_array_elements(gov->'Delegations') AS del
  WHERE coalesce(trim(del->>'PostalCode'),'') <> ''
    AND coalesce(trim(del->>'Name'),'') <> ''
),
dedup AS (
  SELECT DISTINCT ON (code)
    gov_name_norm,
    place_name,
    code,
    latitude,
    longitude
  FROM flat
  WHERE code ~ '^[0-9]{4}$'
  ORDER BY code, gov_name_norm, place_name
)
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT
  gm.id,
  d.code::char(4),
  d.place_name,
  d.latitude,
  d.longitude
FROM dedup d
JOIN gov_map gm ON gm.gov_name_norm = d.gov_name_norm;


-- ==========================================
-- INSERTION COMPLÈTE DES CODES POSTAUX TUNISIENS
-- ==========================================

-- Nettoyer d'abord (optionnel)
TRUNCATE TABLE postal_codes RESTART IDENTITY CASCADE;

-- ==========================================
-- TUNIS
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('1000', 'Tunis Ville', 36.8065, 10.1815),
  ('1001', 'Tunis Medina', 36.7989, 10.1719),
  ('1002', 'Bab Bhar', 36.8003, 10.1850),
  ('1003', 'Bab Souika', 36.8059, 10.1689),
  ('2000', 'Le Bardo', 36.8089, 10.1403),
  ('2016', 'Carthage', 36.8531, 10.3233),
  ('2025', 'La Goulette', 36.8183, 10.3050),
  ('2046', 'Sidi Bou Said', 36.8681, 10.3406),
  ('2060', 'La Marsa', 36.8787, 10.3250),
  ('2070', 'Gammarth', 36.9083, 10.3167)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Tunis';

-- ==========================================
-- ARIANA
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('2080', 'Ariana Ville', 36.8625, 10.1956),
  ('2027', 'Ettadhamen', 36.8353, 10.1736),
  ('2035', 'Mnihla', 36.8517, 10.1428),
  ('2036', 'La Soukra', 36.8514, 10.2139),
  ('2041', 'Raoued', 36.8989, 10.1867),
  ('2056', 'Sidi Thabet', 36.9006, 10.1236),
  ('2083', 'Kalâat El Andalous', 36.9583, 10.1250)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Ariana';

-- ==========================================
-- BEN AROUS
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('2013', 'Ben Arous', 36.7472, 10.2194),
  ('2014', 'Radès', 36.7689, 10.2742),
  ('2015', 'Mégrine', 36.7472, 10.2347),
  ('2033', 'Mohamedia', 36.6764, 10.2858),
  ('2034', 'Ezzahra', 36.7494, 10.3281),
  ('2038', 'Fouchana', 36.7006, 10.1872),
  ('2050', 'Hammam-Lif', 36.7289, 10.3403),
  ('2097', 'Hammam-Chott', 36.7294, 10.3114),
  ('2063', 'Mornag', 36.6789, 10.2628),
  ('2096', 'El Mourouj', 36.7233, 10.1947)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Ben Arous';

-- ==========================================
-- MANOUBA
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('2010', 'Manouba', 36.8102, 10.0983),
  ('2011', 'Den Den', 36.8800, 10.1700),
  ('2012', 'Douar Hicher', 36.8292, 10.0942),
  ('2086', 'Oued Ellil', 36.8500, 10.0500),
  ('2087', 'Mornaguia', 36.7547, 9.9361),
  ('2088', 'Borj El Amri', 36.8619, 9.9631),
  ('2094', 'El Battan', 36.7639, 10.0028),
  ('2098', 'Tebourba', 36.8367, 9.8433)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Manouba';

-- ==========================================
-- NABEUL
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('8000', 'Nabeul', 36.4561, 10.7358),
  ('8020', 'Soliman', 36.7056, 10.4936),
  ('8040', 'Menzel Temime', 36.7667, 10.9958),
  ('8050', 'Korba', 36.5833, 10.8583),
  ('8060', 'Beni Khiar', 36.4681, 10.7856),
  ('8070', 'El Mida', 36.4756, 10.6694),
  ('8090', 'Hammamet', 36.4000, 10.6167),
  ('8019', 'Grombalia', 36.5917, 10.5069),
  ('8033', 'Kelibia', 36.8469, 11.0933),
  ('8045', 'Menzel Bouzelfa', 36.6833, 10.5833)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Nabeul';

-- ==========================================
-- ZAGHOUAN
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('1100', 'Zaghouan', 36.4025, 10.1428),
  ('1110', 'El Fahs', 36.3833, 9.8833),
  ('1120', 'Bir Mcherga', 36.5500, 10.0500),
  ('1130', 'Zriba', 36.3167, 10.3167),
  ('1140', 'Nadhour', 36.2833, 10.0167),
  ('1150', 'Saouaf', 36.4667, 10.0167)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Zaghouan';

-- ==========================================
-- BIZERTE
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('7000', 'Bizerte', 37.2744, 9.8739),
  ('7010', 'Menzel Bourguiba', 37.1528, 9.7861),
  ('7020', 'Mateur', 37.0403, 9.6656),
  ('7030', 'Ras Jebel', 37.2150, 10.0450),
  ('7040', 'Menzel Jemil', 37.2333, 9.9167),
  ('7050', 'Sejnane', 37.0567, 9.2403),
  ('7060', 'Joumine', 37.1667, 9.7000),
  ('7080', 'Tinja', 37.1667, 9.7500),
  ('7090', 'Ghar El Melh', 37.1667, 10.1833),
  ('7035', 'Zarzouna', 37.0500, 9.5167)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Bizerte';

-- ==========================================
-- BÉJA
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('9000', 'Béja', 36.7256, 9.1817),
  ('9010', 'Medjez el-Bab', 36.6478, 9.6100),
  ('9020', 'Testour', 36.5500, 9.4500),
  ('9030', 'Teboursouk', 36.4583, 9.2417),
  ('9040', 'Nefza', 37.0333, 9.3167),
  ('9050', 'Goubellat', 36.5667, 9.6667),
  ('9060', 'Amdoun', 36.8000, 9.1000)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Béja';

-- ==========================================
-- JENDOUBA
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('8100', 'Jendouba', 36.5014, 8.7806),
  ('8110', 'Tabarka', 36.9544, 8.7583),
  ('8120', 'Aïn Draham', 36.7833, 8.6833),
  ('8130', 'Fernana', 36.6667, 8.6667),
  ('8140', 'Bou Salem', 36.6167, 8.9667),
  ('8150', 'Ghardimaou', 36.4500, 8.4333),
  ('8160', 'Oued Meliz', 36.4833, 8.8167),
  ('8170', 'Balta Bou Aouane', 36.6667, 8.5833)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Jendouba';

-- ==========================================
-- KEF
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('7100', 'Le Kef', 36.1742, 8.7050),
  ('7110', 'Dahmani', 35.9667, 8.8167),
  ('7120', 'El Ksour', 35.8833, 8.8833),
  ('7130', 'Tajerouine', 35.8833, 8.5500),
  ('7140', 'Nebeur', 36.2667, 8.7167),
  ('7150', 'Sakiet Sidi Youssef', 36.2167, 8.3500),
  ('7160', 'Kalâat Senan', 36.2833, 8.8833),
  ('7170', 'Kalâat Khasba', 36.0667, 8.6833)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Kef';

-- ==========================================
-- SILIANA
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('6100', 'Siliana', 36.0853, 9.3706),
  ('6110', 'Bou Arada', 36.3500, 9.6167),
  ('6120', 'Gaâfour', 36.3333, 9.3167),
  ('6130', 'El Krib', 36.3167, 9.1333),
  ('6140', 'Makthar', 35.8500, 9.2000),
  ('6150', 'Rouhia', 36.0500, 9.2667),
  ('6160', 'Kesra', 35.8000, 9.3667),
  ('6170', 'Bargou', 36.1000, 9.5500)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Siliana';

-- ==========================================
-- KAIROUAN
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('3100', 'Kairouan', 35.6781, 10.0967),
  ('3110', 'Sbikha', 35.9333, 10.0167),
  ('3120', 'Oueslatia', 35.8500, 9.5500),
  ('3130', 'Haffouz', 35.6333, 9.6833),
  ('3140', 'El Alâa', 35.6000, 9.4167),
  ('3150', 'Hajeb El Ayoun', 35.8833, 9.7667),
  ('3160', 'Nasrallah', 35.4667, 9.8167),
  ('3170', 'Chebika', 35.1333, 9.9333),
  ('3180', 'Bouhajla', 35.9167, 9.8833)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Kairouan';

-- ==========================================
-- KASSERINE
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('1200', 'Kasserine', 35.1675, 8.8306),
  ('1210', 'Sbeitla', 35.2361, 9.1172),
  ('1220', 'Thala', 35.5722, 8.6708),
  ('1230', 'Foussana', 35.5167, 8.9667),
  ('1240', 'Fériana', 34.9500, 8.5667),
  ('1250', 'Hassi El Ferid', 34.8667, 8.8167),
  ('1260', 'Mejel Bel Abbès', 35.1667, 9.2667),
  ('1270', 'Jedeliane', 35.0167, 8.1500)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Kasserine';

-- ==========================================
-- SIDI BOUZID
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('9100', 'Sidi Bouzid', 35.0381, 9.4839),
  ('9110', 'Regueb', 34.8583, 9.7917),
  ('9120', 'Bir El Hafey', 34.9333, 9.2000),
  ('9130', 'Meknassy', 34.6167, 9.6000),
  ('9140', 'Menzel Bouzaiane', 35.0667, 9.5833),
  ('9150', 'Mezzouna', 34.5833, 9.8833),
  ('9160', 'Jilma', 34.2833, 9.5333),
  ('9170', 'Ouled Haffouz', 34.9500, 9.7167)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Sidi Bouzid';

-- ==========================================
-- SOUSSE
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('4000', 'Sousse', 35.8256, 10.6369),
  ('4011', 'Sousse Médina', 35.8261, 10.6381),
  ('4021', 'Hammam Sousse', 35.8583, 10.6000),
  ('4031', 'Msaken', 35.7333, 10.5833),
  ('4041', 'Kalâa Kebira', 35.9000, 10.5167),
  ('4051', 'Kalâa Seghira', 35.8500, 10.4833),
  ('4061', 'Akouda', 35.8667, 10.5667),
  ('4071', 'Sidi Bou Ali', 35.9500, 10.4667),
  ('4081', 'Enfidha', 36.1333, 10.3833),
  ('4091', 'Bouficha', 36.3000, 10.4333)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Sousse';

-- ==========================================
-- MONASTIR
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('5000', 'Monastir', 35.7775, 10.8264),
  ('5010', 'Jemmal', 35.6333, 10.7333),
  ('5020', 'Ksar Hellal', 35.6667, 10.9000),
  ('5030', 'Moknine', 35.6333, 10.9000),
  ('5040', 'Téboulba', 35.6667, 11.0000),
  ('5050', 'Bekalta', 35.6167, 11.0000),
  ('5060', 'Sahline', 35.7500, 10.7167),
  ('5070', 'Bembla', 35.7000, 10.6833),
  ('5080', 'Ouerdanine', 35.7000, 10.6667),
  ('5090', 'Zeramdine', 35.6833, 10.7833)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Monastir';

-- ==========================================
-- MAHDIA
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('5100', 'Mahdia', 35.5047, 11.0622),
  ('5110', 'Ksour Essef', 35.4167, 11.0000),
  ('5120', 'El Jem', 35.3000, 10.7167),
  ('5130', 'Chebba', 35.2333, 11.1167),
  ('5140', 'Melloulech', 35.1667, 11.0333),
  ('5150', 'Sidi Alouane', 35.3667, 10.9833),
  ('5160', 'Ouled Chamekh', 35.2167, 10.8167),
  ('5170', 'Bou Merdes', 35.6167, 10.8833),
  ('5180', 'Hebira', 35.4833, 10.9500)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Mahdia';

-- ==========================================
-- SFAX
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('3000', 'Sfax', 34.7400, 10.7600),
  ('3011', 'Sfax Medina', 34.7400, 10.7600),
  ('3021', 'Sakiet Ezzit', 34.8167, 10.7500),
  ('3031', 'Sakiet Eddaier', 34.8000, 10.6833),
  ('3041', 'Agareb', 34.7500, 10.4500),
  ('3051', 'Jebiniana', 34.7167, 10.9167),
  ('3061', 'El Hencha', 34.6333, 10.7167),
  ('3071', 'Menzel Chaker', 34.5667, 10.3000),
  ('3081', 'El Amra', 34.7167, 10.2167),
  ('3091', 'Bir Ali Ben Khalifa', 34.7333, 10.0833)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Sfax';

-- ==========================================
-- GAFSA
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('2100', 'Gafsa', 34.4250, 8.7842),
  ('2110', 'El Ksar', 34.4167, 8.8167),
  ('2120', 'Moularès', 34.3667, 8.4000),
  ('2130', 'Redeyef', 34.3833, 8.1333),
  ('2140', 'Métlaoui', 34.3167, 8.4000),
  ('2150', 'Mdhilla', 34.3667, 8.0333),
  ('2160', 'El Guettar', 34.3500, 8.9500),
  ('2170', 'Sned', 34.4667, 8.7333),
  ('2180', 'Belkhir', 34.2833, 8.9333)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Gafsa';

-- ==========================================
-- TOZEUR
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('2200', 'Tozeur', 33.9197, 8.1336),
  ('2210', 'Degache', 33.9833, 8.2167),
  ('2220', 'Nefta', 33.8833, 7.8833),
  ('2230', 'Tameghza', 34.4000, 8.0333),
  ('2240', 'Hazoua', 33.8500, 8.4000)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Tozeur';

-- ==========================================
-- KEBILI
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('4200', 'Kebili', 33.7044, 8.9694),
  ('4210', 'Souk Lahad', 33.5833, 9.5000),
  ('4220', 'Douz', 33.4667, 9.0000),
  ('4230', 'El Golâa', 33.4833, 9.0167),
  ('4240', 'Faouar', 33.2833, 9.5167)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Kebili';

-- ==========================================
-- GABÈS
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('6000', 'Gabès', 33.8815, 10.0982),
  ('6011', 'Gabès Medina', 33.8815, 10.0982),
  ('6021', 'El Hamma', 33.8833, 9.8000),
  ('6031', 'Mareth', 33.6333, 10.2833),
  ('6041', 'Métouia', 33.6333, 9.9167),
  ('6051', 'Nouvelle Matmata', 33.5333, 9.9667),
  ('6061', 'Menzel El Habib', 33.7833, 10.0667)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Gabès';

-- ==========================================
-- MEDENINE
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('4100', 'Médenine', 33.3547, 10.5053),
  ('4110', 'Beni Khedache', 33.2500, 10.1833),
  ('4120', 'Ben Gardane', 33.1333, 11.2167),
  ('4130', 'Houmt Souk (Djerba)', 33.8750, 10.8578),
  ('4140', 'Midoun (Djerba)', 33.8000, 10.9833),
  ('4150', 'Ajim (Djerba)', 33.7167, 10.7500),
  ('4160', 'Zarzis', 33.5031, 11.1122),
  ('4170', 'Sidi Makhlouf', 33.5500, 10.6667)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Medenine';

-- ==========================================
-- TATAOUINE
-- ==========================================
INSERT INTO postal_codes (governorate_id, code, place_name, latitude, longitude)
SELECT g.id, code, place_name, latitude, longitude
FROM governorates g, (VALUES
  ('3200', 'Tataouine', 32.9297, 10.4517),
  ('3210', 'Ghomrassen', 33.0667, 10.3500),
  ('3220', 'Remada', 32.3167, 10.3833),
  ('3230', 'Bir Lahmar', 32.7500, 11.1167),
  ('3240', 'Dehiba', 32.0000, 10.7667),
  ('3250', 'Smar', 33.0333, 10.2333)
) AS data(code, place_name, latitude, longitude)
WHERE g.name = 'Tataouine';

-- Vérification finale
SELECT 
  g.name AS governorat,
  COUNT(pc.id) AS nombre_codes_postaux
FROM governorates g
LEFT JOIN postal_codes pc ON g.id = pc.governorate_id
GROUP BY g.name
ORDER BY g.name;

SELECT COUNT(*) AS total_codes_postaux FROM postal_codes;

-- Appareils Fonctionnels
INSERT INTO ref_appareil_fonctionnel (libelle, ordre) VALUES
('Signes Généraux', 1),
('Cardiovasculaire', 2),
('Dermatologique', 3),
('Digestif', 4),
('Génito-Urinaire', 5),
('Neuro-ostéo-musculaire', 6),
('ORL', 7),
('Ophtalmologique', 8),
('Pleuro-Pulmonaire', 9),
('Psychiatrique', 10);

-- Stock Médicaments
INSERT INTO stock_medicaments (code, composition, quantite, dosage, created_by, updated_by) VALUES
('TLD', 'Ténofovir (TDF)/Lamivudine (3TC)/Doltégravir (DTG)', 100, NULL, 1, 1),
('AVONZA', 'Ténofovir (TDF)/Lamivudine (3TC)/Efavirenz (EFV)', 100, NULL, 1, 1),
('COMBIVIR', 'Zidovudine (AZT)/Lamivudine (3TC)', 100, NULL, 1, 1),
('REYATAZ/RITONAVIR', 'Atazanavir (ATV)/Ritonavir (RTV)', 100, NULL, 1, 1),
('KIVEXA', 'Abacavir (ABC)/Lamivudine (3TC)', 100, NULL, 1, 1),
('PREZISTA/RITONAVIR', 'Darunavir (DRV)/Ritonavir (RTV)', 100, NULL, 1, 1),
('TRUVADA', 'Ténofovir (TDF)/Emtricitabine (FTC)', 100, NULL, 1, 1),
('ZIAGEN', 'Abacavir (ABC)', 100, NULL, 1, 1),
('DTG', 'Dolutegravir (DTG)', 100, NULL, 1, 1);

-- Utilisateur Admin
INSERT INTO users (nom, prenom, email, password, role, isactivated) VALUES
('Admin', 'Système', 'admin@vih.tn', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', true);

