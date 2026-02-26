import pool from "../config/db.js";

let passwordResetTableReady = false;

const ensurePasswordResetsTable = async () => {
  if (passwordResetTableReady) return;

  const query = `
    CREATE TABLE IF NOT EXISTS password_resets (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  await pool.query(query);
  passwordResetTableReady = true;
};

export const createPasswordReset = async (userId, tokenHash, expiresAt) => {
  await ensurePasswordResetsTable();

  const query = `
    INSERT INTO password_resets (user_id, token, expires_at)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, token, expires_at, created_at;
  `;
  const values = [userId, tokenHash, expiresAt];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const findValidPasswordResetByToken = async (tokenHash) => {
  await ensurePasswordResetsTable();

  const query = `
    SELECT id, user_id, token, expires_at, created_at
    FROM password_resets
    WHERE token = $1
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1;
  `;
  const result = await pool.query(query, [tokenHash]);
  return result.rows[0] || null;
};

export const deletePasswordResetsByUserId = async (userId) => {
  await ensurePasswordResetsTable();

  await pool.query("DELETE FROM password_resets WHERE user_id = $1", [userId]);
};
