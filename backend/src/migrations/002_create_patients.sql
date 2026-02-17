CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  numero VARCHAR(100) UNIQUE NOT NULL, --FORMATTTTTTTTTTTTTTTT
  name VARCHAR(100) NOT NULL,
  surname VARCHAR(100) NOT NULL,
  birthdate DATE NOT NULL,
  gender VARCHAR(100),
  city_of_Birth VARCHAR(100) NOT NULL,
  city_of_Residence VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(100),
  hospitalisation VARCHAR(20) NOT NULL CHECK (hospitalisation IN ('interne', 'externe')),
  last_visit_date TIMESTAMP,
  created_by INTEGER REFERENCES users(id), -- Qui a créé ce patient
  updated_by INTEGER REFERENCES users(id), -- Qui a mis à jour ce patient
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX idx_patients_name ON patients(name);
CREATE INDEX idx_patients_surname ON patients(surname);
CREATE INDEX idx_patients_birthdate ON patients(birthdate);
CREATE INDEX idx_patients_last_visit_date ON patients(last_visit_date);
CREATE INDEX idx_patients_hospitalisation ON patients(hospitalisation);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_patients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_patients_updated_at();