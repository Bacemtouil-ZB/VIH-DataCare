import pool from "../config/db.js";

// find user by email
export const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const values = [email];

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

// create user
export const createUser = async (email, hashedPassword) => {
  const query = `
    INSERT INTO users (email, password)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [email, hashedPassword];

  const result = await pool.query(query, values);
  return result.rows[0];
};
