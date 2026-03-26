CREATE TABLE IF NOT EXISTS suivi_therapeutique (
  id SERIAL PRIMARY KEY,
  prescription_id INTEGER NOT NULL UNIQUE
    REFERENCES prescription_medicale(id) ON DELETE CASCADE,
  patient_id INTEGER NOT NULL
    REFERENCES patients(id) ON DELETE CASCADE,
  statut_patient VARCHAR(50) NOT NULL DEFAULT 'en attente'
    CHECK (statut_patient IN ('actif', 'perdue de vue', 'en attente', 'decede')),
  date_prochaine_prise DATE,
  date_ecart INTEGER NOT NULL DEFAULT 0 CHECK (date_ecart >= 0),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_suivi_therapeutique_patient_id
  ON suivi_therapeutique(patient_id);
CREATE INDEX IF NOT EXISTS idx_suivi_therapeutique_statut_patient
  ON suivi_therapeutique(statut_patient);
CREATE INDEX IF NOT EXISTS idx_suivi_therapeutique_date_prochaine_prise
  ON suivi_therapeutique(date_prochaine_prise);

CREATE OR REPLACE FUNCTION update_suivi_therapeutique_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_suivi_therapeutique_updated_at_trigger
  ON suivi_therapeutique;
CREATE TRIGGER update_suivi_therapeutique_updated_at_trigger
BEFORE UPDATE ON suivi_therapeutique
FOR EACH ROW
EXECUTE FUNCTION update_suivi_therapeutique_updated_at();
