import pool from "../config/db.js";

export const createAuditLog = async (logData) => {
  const query = `
    INSERT INTO audit_logs (
      request_id,
      session_id,
      user_id,
      user_role,
      patient_id,
      module,
      action,
      entity_id,
      old_data,
      new_data,
      ip_address,
      user_agent,
      is_anomaly
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
    )
  `;

  const values = [
    logData.request_id,
    logData.session_id,
    logData.user_id,
    logData.user_role,
    logData.patient_id,
    logData.module,
    logData.action,
    logData.entity_id,
    logData.old_data,
    logData.new_data,
    logData.ip_address,
    logData.user_agent,
    logData.is_anomaly || false,
  ];

  await pool.query(query, values);
};
