-- Table permission
CREATE TABLE permissions (
  id          UUID,
  patient_id  UUID,
  medecin_id  UUID,
  can_view_viral_load  BOOLEAN DEFAULT false,
  can_view_cd4         BOOLEAN DEFAULT false,
  granted_at  TIMESTAMP,
  expires_at  TIMESTAMP   -- ← bonne pratique : permission avec expiration
);