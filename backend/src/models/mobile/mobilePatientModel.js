import pool from "../../config/db.js";

// Get patient profile by user_id
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
// Link patient record to user account
export const linkPatientToUser = async (patientId, userId) => {
  const query = `
    UPDATE patients
    SET user_id = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, patientId]);
  return result.rows[0];
};

// Find patient by numero — used when doctor creates mobile account
export const findPatientByNumero = async (numero) => {
  const query = `
    SELECT 
      id,
      numero,
      name,
      surname,
      birthdate,
      gender,
      phone,
      hospitalisation,
      status,
      doctor_id,
      user_id
    FROM patients 
    WHERE numero = $1
  `;
  const result = await pool.query(query, [numero]);
  return result.rows[0] || null;
};
