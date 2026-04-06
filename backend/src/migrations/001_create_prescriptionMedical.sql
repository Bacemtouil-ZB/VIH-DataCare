CREATE TABLE IF NOT EXISTS prescription_medicale (
  id                SERIAL PRIMARY KEY,
  patient_id        INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  medecin_id        INTEGER REFERENCES users(id) ON DELETE SET NULL,
  posologie         VARCHAR(255),
  date              DATE NOT NULL DEFAULT CURRENT_DATE,
  periode           INTEGER NOT NULL CHECK (periode > 0),
  periode_modifiee  INTEGER CHECK (periode_modifiee > 0 AND periode_modifiee <= periode),
  statut            VARCHAR(20) NOT NULL DEFAULT 'envoyee'
                    CHECK (statut IN ('envoyee', 'delivree', 'modifie', 'non_validee')),
  date_delivrance   DATE,
  remarque          TEXT,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index
CREATE INDEX IF NOT EXISTS idx_prescription_medicale_patient_id
  ON prescription_medicale(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescription_medicale_medecin_id
  ON prescription_medicale(medecin_id);
CREATE INDEX IF NOT EXISTS idx_prescription_medicale_statut
  ON prescription_medicale(statut);
CREATE INDEX IF NOT EXISTS idx_prescription_medicale_date
  ON prescription_medicale(date);
CREATE INDEX IF NOT EXISTS idx_prescription_medicale_created_at
  ON prescription_medicale(created_at);

-- Trigger updated_at
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

-- Migration : Ajouter periode_modifiee si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'prescription_medicale' 
    AND column_name = 'periode_modifiee'
  ) THEN
    ALTER TABLE prescription_medicale
    ADD COLUMN periode_modifiee INTEGER CHECK (periode_modifiee > 0 AND periode_modifiee <= periode);
  END IF;
END $$;

-- Migration : Ajouter statuts manquants
DO $$ 
BEGIN
  ALTER TABLE prescription_medicale
  DROP CONSTRAINT IF EXISTS prescription_medicale_statut_check;
  
  ALTER TABLE prescription_medicale
  ADD CONSTRAINT prescription_medicale_statut_check
  CHECK (statut IN ('envoyee', 'delivree', 'modifie', 'non_validee'));
END $$;

-- Commentaires
COMMENT ON COLUMN prescription_medicale.periode IS 'Période prescrite par le médecin (en mois)';
COMMENT ON COLUMN prescription_medicale.periode_modifiee IS 'Période modifiée par le pharmacien si stock insuffisant (en mois)';
COMMENT ON COLUMN prescription_medicale.statut IS 'envoyee: en attente validation | delivree: validée sans modification | modifie: validée avec modification période | non_validee: expirée après 48h';
COMMENT ON COLUMN prescription_medicale.date_delivrance IS 'Date de délivrance par le pharmacien';