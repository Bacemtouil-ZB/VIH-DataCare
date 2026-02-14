

CREATE TABLE ordonnances (
  id SERIAL PRIMARY KEY,
  nom_traitement VARCHAR(500) NOT NULL,
  quantite_prescrite INTEGER NOT NULL CHECK (quantite_prescrite > 0),
  
    date_prescription DATE NOT NULL DEFAULT CURRENT_DATE,
  date_debut_traitement DATE NOT NULL,
  date_prochaine_prise DATE,
  
  duree_perte_de_vue INTEGER, -- Nombre de jours de retard
  
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  medecin_id INTEGER NOT NULL REFERENCES users(id),
  
  statut VARCHAR(50) NOT NULL DEFAULT 'en cours de suivi' 
    CHECK (statut IN ('en cours de suivi', 'perdu de vue', 'en fin de suivi','decedé')),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- FONCTION pour calculer la durée de perte de vue
-- Différence entre date actuelle et date prochaine prise
-- ==========================================
CREATE OR REPLACE FUNCTION calculate_duree_perte_de_vue()
RETURNS TRIGGER AS $$
BEGIN
    -- Si date_prochaine_prise existe et est dépassée
    IF NEW.date_prochaine_prise IS NOT NULL THEN
        -- Calculer la différence en jours
        NEW.duree_perte_de_vue := EXTRACT(DAY FROM (NOW()::DATE - NEW.date_prochaine_prise));
        
        -- Si négatif (date future), mettre à 0
        IF NEW.duree_perte_de_vue < 0 THEN
            NEW.duree_perte_de_vue := 0;
        END IF;
        
        -- Si plus de 180 jours de retard, marquer comme perdu de vue
        IF NEW.duree_perte_de_vue > 180 AND NEW.statut = 'en_cours' THEN
            NEW.statut := 'perdu_de_vue';
        END IF;
    ELSE
        NEW.duree_perte_de_vue := 0;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour calculer automatiquement à chaque INSERT/UPDATE
DROP TRIGGER IF EXISTS calculate_duree_perte_de_vue_trigger ON ordonnances;
CREATE TRIGGER calculate_duree_perte_de_vue_trigger
    BEFORE INSERT OR UPDATE ON ordonnances
    FOR EACH ROW
    EXECUTE FUNCTION calculate_duree_de_vue();

-- ==========================================
-- TRIGGER pour mettre à jour updated_at
-- ==========================================
CREATE OR REPLACE FUNCTION update_ordonnances_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_ordonnances_updated_at ON ordonnances;
CREATE TRIGGER update_ordonnances_updated_at
    BEFORE UPDATE ON ordonnances
    FOR EACH ROW
    EXECUTE FUNCTION update_ordonnances_updated_at();
