import pool from "../config/db.js";

//-------------------------registrer un utilisateur-------------------------
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
    RETURNING id, nom, prenom, email, role, isactivated, created_at; -- On retourne les infos de l'utilisateur créé
  `;
  const values = [nom, prenom, email, hashedPassword, role, isactivated];

  const result = await pool.query(query, values);
  return result.rows[0];
};
//----------------------------------------------------------------------------------
//-----------------------login de l'utilisateur-------------------------
// find user by email
export const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const values = [email];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

//----------------------------------------------------------------------------------

//-----------------------activation et désactivation de l'utilisateur-------------------------
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

//---------------------------------------------------------------------------------------------------
//---------------- upadate user role --------------------------
// Changer rôle
export const updateUserRole = async (userId, role) => {
  const result = await pool.query(
    "UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, nom, prenom, email, role, isactivated",
    [role, userId],
  );
  return result.rows[0];
};
//---------------------------------------------

//----------------------change user password-------------------------
// Mettre a jour le mot de passe d'un utilisateur par ID
export const updateUserPasswordById = async (userId, hashedPassword) => {
  const query = `
    UPDATE users
    SET password = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, nom, prenom, email, role, isactivated, updated_at;
  `;
  const values = [hashedPassword, userId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
};
//------------------------------------------------------------

//----------------------get all users used for admin panel ! -------------------------
export const getAllUsers = async () => {
  const query = `
    SELECT 
      u.id,
      u.role,
      u.isactivated,
      u.created_at,
      u.updated_at,
      -- Pour les patients : prendre les données de la table patients
      -- Pour les autres roles : prendre les données de la table users
      COALESCE(p.name, u.nom)       AS nom,
      COALESCE(p.surname, u.prenom) AS prenom,
      COALESCE(p.email, u.email)    AS email
    FROM users u
    LEFT JOIN patients p ON p.user_id = u.id
    WHERE u.role != 'admin'
    ORDER BY u.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};
//----------------------------------------------------------------------------------


//----------------------get all doctors used for profil patient -------------------------
// Récupérer tous les médecins (pour les formulaires de sélection)
export const getAllDoctors = async () => {
  try {
    const query = `
      SELECT id, nom, prenom, email
      FROM users
      WHERE role = 'medecin'
        AND isactivated = true
      ORDER BY nom ASC, prenom ASC;
    `;

    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Erreur getAllDoctors:", error);
    throw error;
  }
};
//----------------------------------------------------------------------------------


//gestion du profil : update user info (nom, prenom, email, password)
// Récupérer un utilisateur par ID
export const findUserById = async (userId) => {
  const query = "SELECT * FROM users WHERE id = $1";
  const result = await pool.query(query, [userId]);
  return result.rows[0] || null;
};

// Mettre à jour les infos personnelles (nom, prenom, email)
export const updateUserInfo = async (userId, { nom, prenom, email }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const query = `
    UPDATE users
    SET nom = $1, prenom = $2, email = $3, updated_at = NOW()
    WHERE id = $4
    RETURNING id, nom, prenom, email, role, isactivated, updated_at;
  `;
  const result = await pool.query(query, [
    nom,
    prenom,
    normalizedEmail,
    userId,
  ]);
  return result.rows[0] || null;
};
