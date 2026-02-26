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
  isactivated = false,
) => {
  const query = `
    INSERT INTO users (nom, prenom, email, password, role, isactivated)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, nom, prenom, email, role, isactivated, created_at;
  `;
  const values = [nom, prenom, email, hashedPassword, role, isactivated];

  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * Met à jour le statut d'activation d'un utilisateur
 */
export const updateUserActivationStatus = async (userId, isactivated) => {
  const query = `
    UPDATE users 
    SET isactivated = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, nom, prenom, email, role, isactivated, updated_at;
  `;
  const values = [isactivated, userId];
  const result = await pool.query(query, values);
  return result.rows[0];
};
/// a reviser :
/**
 * Récupère tous les utilisateurs (pour l'admin)

 */
export const getAllUsers = async () => {
  // Récupérer tous les utilisateurs sauf ceux dont le rôle est 'admin'
  const query = `
    SELECT id, nom, prenom, email, role, isactivated, created_at, updated_at
    FROM users
    WHERE role != 'admin'
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};
// Changer rôle
export const updateUserRole = async (userId, role) => {
  const result = await pool.query(
    "UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, nom, prenom, email, role, isactivated",
    [role, userId],
  );
  return result.rows[0];
};

// Récupérer tous les médecins (pour les formulaires de sélection)
export const getAllDoctors = async () => {
  try {
    const query = `
      SELECT id, nom, prenom, email
      FROM users
      WHERE role = 'medecin'
      ORDER BY nom, prenom;
    `;
    const result = await pool.query(query);
    return result.rows; // renvoie tableau [{id, nom, prenom, email}, ...]
  } catch (error) {
    console.error("Erreur getAllDoctors:", error);
    throw error;
  }
};
