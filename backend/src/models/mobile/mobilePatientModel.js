import pool from "../../config/db.js";


export const findPatientByUserId = async (userId) => {
  const query = `
    SELECT 
      p.id,
      p.numero,
      p.name,
      p.surname,
      p.birthdate,
      p.gender,
      p.phone,
      p.hospitalisation,
      p.status,
      p.doctor_id,
      u.username,
      u.must_change_password
    FROM patients p
    JOIN users u ON u.id = p.user_id
    WHERE p.user_id = $1
  `;
  const result = await pool.query(query, [userId]);
  return result.rows[0] || null;
};


export const checkPatientHasMobileAccount = async (patientId) => {
  const query = `
    SELECT p.id, p.user_id, p.numero, p.name, p.surname
    FROM patients p
    WHERE p.id = $1
  `;
  const result = await pool.query(query, [patientId]);
  return result.rows[0] || null;
};


export const linkPatientToUser = async (client, patientId, userId, doctorId) => {
  const query = `
    UPDATE patients 
    SET user_id = $1, updated_by = $2, updated_at = NOW()
    WHERE id = $3
    RETURNING *;
  `;
  const result = await client.query(query, [userId, doctorId, patientId]);
  return result.rows[0];
};


export const getPatientWithMobileAccount = async (patientId) => {
  const query = `
    SELECT 
      p.id,
      p.numero,
      p.name,
      p.surname,
      p.user_id,
      u.username,
      u.isactivated,
      u.must_change_password
    FROM patients p
    LEFT JOIN users u ON u.id = p.user_id
    WHERE p.id = $1
  `;
  const result = await pool.query(query, [patientId]);
  return result.rows[0] || null;
};


export const findPatientByNumero = async (numero) => {
  const query = `
    SELECT 
      p.id,
      p.numero,
      p.name,
      p.surname,
      p.user_id
    FROM patients p
    WHERE p.numero = $1
  `;
  const result = await pool.query(query, [numero]);
  return result.rows[0] || null;
};