
CREATE TABLE ordonnances (
  id SERIAL PRIMARY KEY,
  nom_traitement VARCHAR(500) NOT NULL,
  quantite_prescrite INTEGER NOT NULL CHECK (quantite_prescrite > 0),
  
  date_prescription DATE NOT NULL DEFAULT CURRENT_DATE,
    date_prescription DATE NOT NULL DEFAULT CURRENT_DATE,
  date_debut_traitement DATE NOT NULL,
  date_prochaine_prise  DATE,

  patient_id  INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  medecin_id  INTEGER NOT NULL REFERENCES users(id),

  -- Statut médical géré manuellement par le médecin
  statut VARCHAR(50) NOT NULL DEFAULT 'en cours de suivi'
    CHECK (statut IN ('en cours de suivi', 'perdu de vue', 'en fin de suivi', 'decedé')),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE OR REPLACE FUNCTION update_ordonnances_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_ordonnances_updated_at ON ordonnances;
CREATE TRIGGER trg_update_ordonnances_updated_at
  BEFORE UPDATE ON ordonnances
  FOR EACH ROW
  EXECUTE FUNCTION update_ordonnances_updated_at();