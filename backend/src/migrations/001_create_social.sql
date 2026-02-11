CREATE TABLE IF NOT EXISTS social (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    remarque TEXT, -- Remarques générales
  niveau_etude VARCHAR(100), -- Niveau d'études (primaire, secondaire, universitaire, etc.)
  nombre_enfants INTEGER DEFAULT 0, -- Nombre d'enfants
  ressources TEXT, -- Ressources financières (détails)
  activite_professionnelle VARCHAR(200), -- Activité professionnelle actuelle
  probleme TEXT, -- Problèmes rencontrés
  acces_soins TEXT, -- Accès aux soins (difficultés, facilités)
  situation_social VARCHAR(100), -- Situation familiale (célibataire, marié(e), divorcé(e), etc.)
  
  created_by INTEGER REFERENCES users(id), -- Qui a créé cette fiche sociale
  updated_by INTEGER REFERENCES users(id), -- Qui a mis à jour cette fiche
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_patient_social UNIQUE (patient_id)
);

CREATE INDEX IF NOT EXISTS idx_social_patient_id ON social(patient_id);
-- TRIGGER pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_social_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_social_updated_at ON social;
CREATE TRIGGER update_social_updated_at
    BEFORE UPDATE ON social
    FOR EACH ROW
    EXECUTE FUNCTION update_social_updated_at();

