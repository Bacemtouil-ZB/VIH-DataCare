CREATE TABLE vih (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    mode_contamination VARCHAR(50) ,
    type_depistage VARCHAR(20),
    circonstance_decouverte VARCHAR(100) , --not null 
    date_derniere_negative DATE,
  date_contamination DATE,
  date_vih_positif DATE,
    stade_cdc VARCHAR(10) ,
    debut_stade_c DATE,
    profil_seroconversion BOOLEAN DEFAULT FALSE,
    typage_hla_b5701 VARCHAR(10),
    created_by INTEGER REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(patient_id)
);
-- Index pour optimiser les recherches
CREATE INDEX idx_vih_patient_id ON vih(patient_id);
-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_vih_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_vih_updated_at ON vih;
CREATE TRIGGER update_vih_updated_at
    BEFORE UPDATE ON vih
    FOR EACH ROW
    EXECUTE FUNCTION update_vih_updated_at();