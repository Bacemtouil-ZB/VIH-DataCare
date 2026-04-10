DROP TABLE permissions;

CREATE TABLE permissions (
  id          UUID,
  patient_id  INTEGER,
  medecin_id  INTEGER,
  can_view_viral_load  BOOLEAN DEFAULT false,
  can_view_cd4         BOOLEAN DEFAULT false,
  granted_at  TIMESTAMP,
  expires_at  TIMESTAMP
); 

ALTER TABLE permissions
ADD CONSTRAINT permissions_patient_medecin_unique 
UNIQUE (patient_id, medecin_id);