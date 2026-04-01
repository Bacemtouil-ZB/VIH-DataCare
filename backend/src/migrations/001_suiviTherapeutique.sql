-- ── 1. Nettoyage ──────────────────────────────────────────────
DROP TRIGGER  IF EXISTS trg_suivi_updated_at ON suivi_therapeutique;
DROP FUNCTION IF EXISTS fn_suivi_updated_at();
DROP TABLE    IF EXISTS suivi_therapeutique CASCADE;
 
 
CREATE TABLE suivi_therapeutique (
  id               SERIAL      PRIMARY KEY,
 
  prescription_id  INTEGER     NOT NULL UNIQUE
                               REFERENCES prescription_medicale(id)
                               ON DELETE CASCADE,
 
  patient_id       INTEGER     NOT NULL
                               REFERENCES patients(id)
                               ON DELETE CASCADE,
 
  statut_patient   VARCHAR(50) NOT NULL DEFAULT 'en attente'
                               CHECK (statut_patient IN (
                                 'actif',
                                 'perdue de vue',
                                 'décédé',
                                 'Transferté',
                                 'en attente'
                               )),
 
  date_prochaine_prise DATE,
 
  date_ecart       INTEGER     NOT NULL DEFAULT 0
                               CHECK (date_ecart >= 0),
 
  created_at       TIMESTAMP   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP   NOT NULL DEFAULT NOW()
);
 
 
-- ── 3. Index ──────────────────────────────────────────────────
CREATE INDEX idx_st_patient_id
  ON suivi_therapeutique(patient_id);
 
CREATE INDEX idx_st_statut_patient
  ON suivi_therapeutique(statut_patient);
 
CREATE INDEX idx_st_date_prochaine_prise
  ON suivi_therapeutique(date_prochaine_prise);
 
 
-- ── 4. Trigger updated_at ─────────────────────────────────────
CREATE FUNCTION fn_suivi_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;
 
CREATE TRIGGER trg_suivi_updated_at
BEFORE UPDATE ON suivi_therapeutique
FOR EACH ROW EXECUTE FUNCTION fn_suivi_updated_at();
 
 
-- ── 5. Backfill des prescriptions déjà délivrées ─────────────
-- Remplit date_delivrance si NULL (validations anciennes sans trigger)
--UPDATE prescription_medicale
--SET
  --date_delivrance = COALESCE(updated_at::DATE, created_at::DATE, CURRENT_DATE),
  --updated_at      = NOW()
--WHERE statut          = 'delivree'
  --AND date_delivrance IS NULL;
 
-- Insère une ligne suivi pour chaque prescription delivree
-- qui n'en a pas encore
INSERT INTO suivi_therapeutique (
  prescription_id,
  patient_id,
  date_prochaine_prise,
  statut_patient,
  date_ecart
)
SELECT
  pm.id,
  pm.patient_id,
  (pm.date_delivrance + (pm.quantite * INTERVAL '1 month'))::DATE,
  CASE
    WHEN CURRENT_DATE
         - (pm.date_delivrance + (pm.quantite * INTERVAL '1 month'))::DATE > 60
      THEN 'perdue de vue'
    ELSE 'actif'
  END,
  GREATEST(
    0,
    CURRENT_DATE
    - (pm.date_delivrance + (pm.quantite * INTERVAL '1 month'))::DATE
  )
FROM prescription_medicale pm
WHERE pm.statut          = 'delivree'
  AND pm.date_delivrance IS NOT NULL
  AND pm.quantite        > 0
  AND NOT EXISTS (
    SELECT 1 FROM suivi_therapeutique st
    WHERE st.prescription_id = pm.id
  );
 