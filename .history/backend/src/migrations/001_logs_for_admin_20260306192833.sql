-- List view: used by table endpoints (no old_data/new_data)
CREATE OR REPLACE VIEW audit_logs_list_v AS
SELECT
  al.id,
  al.created_at,
  al.module,
  al.action,

  al.user_id,
  al.user_role,
  u.nom    AS user_nom,
  u.prenom AS user_prenom,
  u.email  AS user_email,

  al.patient_id,
  p.numero AS patient_numero,

  al.ip_address,
  al.is_anomaly
FROM audit_logs al
LEFT JOIN users u ON u.id = al.user_id
LEFT JOIN patients p ON p.id = al.patient_id;


-- Details view: used by details endpoint/modal (includes json + user_agent etc.)
CREATE OR REPLACE VIEW audit_logs_details_v AS
SELECT
  al.id,
  al.created_at,
  al.module,
  al.action,

  al.user_id,
  al.user_role,
  u.nom    AS user_nom,
  u.prenom AS user_prenom,
  u.email  AS user_email,

  al.patient_id,
  p.numero AS patient_numero,

  al.ip_address,
  al.user_agent,
  al.request_id,
  al.session_id,

  al.is_anomaly,

  al.old_data,
  al.new_data
FROM audit_logs al
LEFT JOIN users u ON u.id = al.user_id
LEFT JOIN patients p ON p.id = al.patient_id;


CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at_desc ON audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_patient_created ON audit_logs (patient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created ON audit_logs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_anomaly_created ON audit_logs (is_anomaly, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_module_created ON audit_logs (module, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_created ON audit_logs (action, created_at DESC);