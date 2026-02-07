import pool from "../config/db.js";

// find user by email
export const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const values = [email];

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

// create user
export const createUser = async (
  nom,
  prenom,
  email,
  hashedPassword,
  role,
  isActivated = false,
) => {
  const query = `
    INSERT INTO users (nom, prenom, email, password, role, isActivated)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, nom, prenom, email, role, isActivated, created_at;
  `;
  const values = [nom, prenom, email, hashedPassword, role, isActivated];

  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * Met à jour le statut d'activation d'un utilisateur
 */
export const updateUserActivationStatus = async (userId, isActivated) => {
  const query = `
    UPDATE users 
    SET isActivated = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, nom, prenom, email, role, isActivated, updated_at;
  `;
  const values = [isActivated, userId];

  const result = await pool.query(query, values);
  return result.rows[0];
};
/// a reviser :
/**
 * Récupère tous les utilisateurs (pour l'admin)

 */
export const getAllUsers = async () => {
  let query = `
    SELECT  nom, prenom, email, role, isActivated, created_at, updated_at
    FROM users
  `;
  const values = [];
  query += " ORDER BY created_at DESC";

  const result = await pool.query(query, values);
  return result.rows;
};
