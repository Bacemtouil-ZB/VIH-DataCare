CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  surname VARCHAR(100) NOT NULL,
  birthdate DATE NOT NULL,
  gender VARCHAR(100),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postalcode VARCHAR(20) NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  height DECIMAL(5,2)  NOT NULL,
  modeoftransmission VARCHAR(100)  NOT NULL,
  maritalstatus VARCHAR(50)  NOT NULL ,
  numberchildren INTEGER DEFAULT 0,
  educationlevel VARCHAR(100),
  housing VARCHAR(100),
  created_by INTEGER REFERENCES users(id), -- Qui a créé ce patient
  updated_by INTEGER REFERENCES users(id), -- Qui a mis à jour ce patient
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX idx_patients_name ON patients(name);
CREATE INDEX idx_patients_surname ON patients(surname);
CREATE INDEX idx_patients_birthdate ON patients(birthdate);

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
