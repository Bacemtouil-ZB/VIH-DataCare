import pool from "../config/db.js";

// find user by email
export const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const values = [email];

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

// create user
export const createUser = async (email, hashedPassword,role,isActivated) => {
  const query = `
    INSERT INTO users (email, password, role, isActivated)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [email, hashedPassword,role,isActivated];

  const result = await pool.query(query, values);
  return result.rows[0];
};
