import pool from "../../config/db.js";

// Find patient by username (numero) — used for mobile login
export const findPatientUserByUsername = async (username) => {
  const query = `
    SELECT * FROM users 
    WHERE username = $1 AND role = 'patient'
  `;
  const result = await pool.query(query, [username]);
  return result.rows[0] || null;
};

// Create user account for patient
export const createPatientUser = async (username, hashedPassword) => {
  const query = `
    INSERT INTO users (username, password, role, isactivated, must_change_password)
    VALUES ($1, $2, 'patient', true, true)
    RETURNING id, username, role, isactivated, must_change_password;
  `;
  const result = await pool.query(query, [username, hashedPassword]);
  return result.rows[0];
};

// Update must_change_password after first login
export const updateMustChangePassword = async (userId, value) => {
  const query = `
    UPDATE users 
    SET must_change_password = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, username, role, must_change_password;
  `;
  const result = await pool.query(query, [value, userId]);
  return result.rows[0];
};

// Update password — used on first login forced change
export const updatePatientPassword = async (userId, hashedPassword) => {
  const query = `
    UPDATE users
    SET password = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, username, role, must_change_password;
  `;
  const result = await pool.query(query, [hashedPassword, userId]);
  return result.rows[0];
};

// Save Expo push token — used for rendez-vous notifications
export const savePushToken = async (userId, pushToken) => {
  const query = `
    UPDATE users
    SET expo_push_token = $1, updated_at = NOW()
    WHERE id = $2
  `;
  await pool.query(query, [pushToken, userId]);
};

// Get user by id — used by mobileAuthMiddleware to verify token
export const findMobileUserById = async (id) => {
  const query = `
    SELECT id, username, role, isactivated, must_change_password, expo_push_token
    FROM users
    WHERE id = $1 AND role = 'patient'
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};
