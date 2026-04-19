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
 
 
---bacem 19/04/2025
-- 1. Supprimer ancien CHECK statut

ALTER TABLE public.suivi_therapeutique
  DROP CONSTRAINT suivi_therapeutique_statut_patient_check;

-- 2. Corriger DEFAULT
ALTER TABLE public.suivi_therapeutique
  ALTER COLUMN statut_patient SET DEFAULT 'actif';

-- 3. Ajouter nouveau CHECK
ALTER TABLE public.suivi_therapeutique
  ADD CONSTRAINT suivi_therapeutique_statut_patient_check
    CHECK (statut_patient::text = ANY (ARRAY[
      'actif'::character varying,
      'en_retard'::character varying,
      'perdu_de_vue'::character varying,
      'recupere'::character varying
    ]::text[]));

-- 4. Corriger les valeurs existantes si nécessaire
UPDATE public.suivi_therapeutique
  SET statut_patient = 'actif'
  WHERE statut_patient NOT IN ('actif', 'en_retard', 'perdu_de_vue', 'recupere');

ALTER TABLE suivi_therapeutique
ADD COLUMN alerte_contradiction BOOLEAN DEFAULT false;