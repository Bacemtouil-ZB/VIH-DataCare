CREATE TABLE IF NOT EXISTS prescription_medicale (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  medecin_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  medicament_id INTEGER REFERENCES stock_medicaments(id) ON DELETE SET NULL,
  dosage VARCHAR(255),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  quantite INTEGER NOT NULL CHECK (quantite > 0),
  statut VARCHAR(20) NOT NULL DEFAULT 'envoyee'
    CHECK (statut IN ('envoyee', 'delivree')),
  date_delivrance DATE,
  remarque TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_prescription_medicale_patient_id
  ON prescription_medicale(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescription_medicale_medecin_id
  ON prescription_medicale(medecin_id);
CREATE INDEX IF NOT EXISTS idx_prescription_medicale_statut
  ON prescription_medicale(statut);
CREATE INDEX IF NOT EXISTS idx_prescription_medicale_date
  ON prescription_medicale(date);

CREATE OR REPLACE FUNCTION update_prescription_medicale_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_prescription_medicale_updated_at_trigger
  ON prescription_medicale;
CREATE TRIGGER update_prescription_medicale_updated_at_trigger
BEFORE UPDATE ON prescription_medicale
FOR EACH ROW
EXECUTE FUNCTION update_prescription_medicale_updated_at();

ALTER TABLE prescription_medicale
DROP COLUMN posologie

ALTER TABLE prescription_medicale
DROP COLUMN quantite_delivree
