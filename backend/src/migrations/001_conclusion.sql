-- Table: doctor_conclusions
-- A doctor writes a conclusion for a patient (VIH follow-up summary, plan, etc.)

CREATE TABLE IF NOT EXISTS doctor_conclusions (
  id          BIGSERIAL PRIMARY KEY,
  patient_id  BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Keep updated_at current
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_doctor_conclusions_updated_at ON doctor_conclusions;
CREATE TRIGGER trg_doctor_conclusions_updated_at
BEFORE UPDATE ON doctor_conclusions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Index for history list
CREATE INDEX IF NOT EXISTS idx_doctor_conclusions_patient_created
  ON doctor_conclusions (patient_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_doctor_conclusions_doctor_created
  ON doctor_conclusions (doctor_id, created_at DESC);