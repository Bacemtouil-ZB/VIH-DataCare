import pool from "../config/db.js";

// find user by email
export const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const values = [email];

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

// create user
export const createUser = async (nom, prenom, email, hashedPassword, role, isActivated = false) => {
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
 * @param {number} userId 
 * @param {boolean} isActivated 
 * @returns {Object} Utilisateur mis à jour
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
 * @param {string} roleFilter - Optionnel: filtrer par rôle
 * @returns {Array} Liste des utilisateurs
 */
export const getAllUsers = async (roleFilter = null) => {
  let query = `
    SELECT id, nom, prenom, email, role, isActivated, created_at, updated_at
    FROM users
  `;
  const values = [];

  if (roleFilter) {
    query += " WHERE role = $1";
    values.push(roleFilter);
  }

  query += " ORDER BY created_at DESC";

  const result = await pool.query(query, values);
  return result.rows;
};

/**
 * Supprime un utilisateur (soft delete possible plus tard)
 * @param {number} userId 
 * @returns {boolean} True si supprimé
 */
export const deleteUser = async (userId) => {
  const query = "DELETE FROM users WHERE id = $1";
  const values = [userId];

  const result = await pool.query(query, values);
  return result.rowCount > 0;
};
