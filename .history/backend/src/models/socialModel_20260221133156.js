import pool from "../config/db.js";

export const getSocialByNumero = async (numero) => {
  const query = `
    SELECT 
      s.*,
      p.id as patient_id,
      p.numero as patient_numero,
      p.name as patient_name,
      p.surname as patient_surname
    FROM social s
    INNER JOIN patients p ON s.patient_id = p.id
    WHERE p.numero = $1;
  `;

  const result = await pool.query(query, [numero]);
  const row = result.rows[0];

  if (!row) return null;

  // 🔥 CONVERSION PROPRE ENUM[] → JS ARRAY
  if (typeof row.probleme === "string") {
    row.probleme = row.probleme
      .replace(/^{|}$/g, "") // enlève { }
      .split(",") // transforme en array
      .filter(Boolean); // enlève éléments vides
  }

  return row;
};

// Créer une fiche sociale
export const createSocial = async (numero, socialData) => {
  // Récupérer l'ID du patient à partir du numéro
  const patientQuery = `SELECT id FROM patients WHERE numero = $1`;
  const patientResult = await pool.query(patientQuery, [numero]);

  if (!patientResult.rows[0]) {
    throw new Error("Patient non trouvé");
  }

  const patient_id = patientResult.rows[0].id;

  const {
    situation_social,
    niveau_etude,
    nombre_enfants,
    type_ressource,
    activite_professionnelle,
    probleme,
    remarque,
  } = socialData;

  const query = `
    INSERT INTO social (
      patient_id,
      situation_social,
      niveau_etude,
      nombre_enfants,
      type_ressource,
      activite_professionnelle,
      probleme,
      remarque,
      created_by,
      updated_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)
    RETURNING *;
  `;

  const values = [
    patient_id,
    situation_social || null,
    niveau_etude || null,
    nombre_enfants || 0,
    type_ressource || null,
    activite_professionnelle || null,
    probleme && probleme.length > 0 ? probleme : null,
    remarque || null,
    socialData.userId,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Mettre à jour une fiche sociale
export const updateSocial = async (numero, socialData) => {
  const existingQuery = `
    SELECT s.id 
    FROM social s
    INNER JOIN patients p ON s.patient_id = p.id
    WHERE p.numero = $1
  `;
  const existingResult = await pool.query(existingQuery, [numero]);

  if (!existingResult.rows[0]) {
    throw new Error("Fiche sociale non trouvée");
  }

  const socialId = existingResult.rows[0].id;

  const {
    situation_social,
    niveau_etude,
    nombre_enfants,
    type_ressource,
    activite_professionnelle,
    probleme,
    remarque,
    userId,
  } = socialData;

  const query = `
    UPDATE social
    SET
      situation_social = COALESCE($1, situation_social),
      niveau_etude = COALESCE($2, niveau_etude),
      nombre_enfants = COALESCE($3, nombre_enfants),
      type_ressource = COALESCE($4, type_ressource),
      activite_professionnelle = COALESCE($5, activite_professionnelle),
      probleme = COALESCE($6::probleme_enum[], probleme),
      remarque = COALESCE($7, remarque),
      updated_by = $8,
      updated_at = NOW()
    WHERE id = $9
    RETURNING *;
  `;

  const values = [
    situation_social || null,
    niveau_etude || null,
    nombre_enfants || 0,
    type_ressource || null,
    activite_professionnelle || null,
    Array.isArray(probleme) ? probleme : null,
    remarque || null,
    userId,
    socialId,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};
