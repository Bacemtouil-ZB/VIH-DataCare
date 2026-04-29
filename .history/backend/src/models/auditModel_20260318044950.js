import pool from "../config/db.js";

// export const createAuditLog = async (logData) => {
//   const query = `
//     INSERT INTO audit_logs (
//       request_id,
//       user_id,
//       user_role,
//       patient_id,
//       module,
//       action,
//       entity_id,
//       old_data,
//       new_data,
//       ip_address,
//       user_agent,
//       is_anomaly
//     )
//     VALUES (
//       $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
//     )
//   `;

//   const values = [
//     logData.request_id,
//     logData.user_id,
//     logData.user_role,
//     logData.patient_id,
//     logData.module,
//     logData.action,
//     logData.entity_id,
//     logData.old_data,
//     logData.new_data,
//     logData.ip_address,
//     logData.user_agent,
//     logData.is_anomaly || false,
//   ];

//   await pool.query(query, values);
// };

// start from this function are for admin dashboard to view audit logs

// Resolve patient by exact numero
export const findPatientByNumero = async (numero) => {
  const query = `
    SELECT id, numero, name, surname
    FROM patients
    WHERE numero = $1
  `;
  const result = await pool.query(query, [numero]);
  return result.rows[0] || null;
};

// ---------- Global list ----------
export const getAuditLogsGlobal = async ({
  module = null,
  action = null,
  userId = null,
  anomaly = null,
  from = null,
  to = null,
  limit = 50,
  offset = 0,
}) => {
  const query = `
    SELECT *
    FROM audit_logs_list_v
    WHERE 1=1
      AND ($1::text IS NULL OR module = $1)
      AND ($2::action_enum IS NULL OR action = $2)
      AND ($3::int IS NULL OR user_id = $3)
      AND ($4::boolean IS NULL OR is_anomaly = $4)
      AND ($5::date IS NULL OR created_at >= $5::timestamp)
      AND ($6::date IS NULL OR created_at < ($6::date + interval '1 day'))
    ORDER BY created_at DESC
    LIMIT $7 OFFSET $8
  `;

  const values = [module, action, userId, anomaly, from, to, limit, offset];
  const result = await pool.query(query, values);
  return result.rows;
};

export const countAuditLogsGlobal = async ({
  module = null,
  action = null,
  userId = null,
  anomaly = null,
  from = null,
  to = null,
}) => {
  const query = `
    SELECT COUNT(*)::int AS total
    FROM audit_logs_list_v
    WHERE 1=1
      AND ($1::text IS NULL OR module = $1)
      AND ($2::action_enum IS NULL OR action = $2)
      AND ($3::int IS NULL OR user_id = $3)
      AND ($4::boolean IS NULL OR is_anomaly = $4)
      AND ($5::date IS NULL OR created_at >= $5::timestamp)
      AND ($6::date IS NULL OR created_at < ($6::date + interval '1 day'))
  `;

  const values = [module, action, userId, anomaly, from, to];
  const result = await pool.query(query, values);
  return result.rows[0]?.total ?? 0;
};

// ---------- Patient list ----------
export const getAuditLogsByPatientId = async ({
  patientId,
  module = null,
  action = null,
  userId = null,
  anomaly = null,
  from = null,
  to = null,
  limit = 50,
  offset = 0,
}) => {
  const query = `
    SELECT *
    FROM audit_logs_list_v
    WHERE patient_id = $1
      AND ($2::text IS NULL OR module = $2)
      AND ($3::action_enum IS NULL OR action = $3)
      AND ($4::int IS NULL OR user_id = $4)
      AND ($5::boolean IS NULL OR is_anomaly = $5)
      AND ($6::date IS NULL OR created_at >= $6::timestamp)
      AND ($7::date IS NULL OR created_at < ($7::date + interval '1 day'))
    ORDER BY created_at DESC
    LIMIT $8 OFFSET $9
  `;

  const values = [
    patientId,
    module,
    action,
    userId,
    anomaly,
    from,
    to,
    limit,
    offset,
  ];
  const result = await pool.query(query, values);
  return result.rows;
};

export const countAuditLogsByPatientId = async ({
  patientId,
  module = null,
  action = null,
  userId = null,
  anomaly = null,
  from = null,
  to = null,
}) => {
  const query = `
    SELECT COUNT(*)::int AS total
    FROM audit_logs_list_v
    WHERE patient_id = $1
      AND ($2::text IS NULL OR module = $2)
      AND ($3::action_enum IS NULL OR action = $3)
      AND ($4::int IS NULL OR user_id = $4)
      AND ($5::boolean IS NULL OR is_anomaly = $5)
      AND ($6::date IS NULL OR created_at >= $6::timestamp)
      AND ($7::date IS NULL OR created_at < ($7::date + interval '1 day'))
  `;

  const values = [patientId, module, action, userId, anomaly, from, to];
  const result = await pool.query(query, values);
  return result.rows[0]?.total ?? 0;
};

// ---------- Details ----------
export const getAuditLogDetailsById = async (id) => {
  const query = `
    SELECT *
    FROM audit_logs_details_v
    WHERE id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};
