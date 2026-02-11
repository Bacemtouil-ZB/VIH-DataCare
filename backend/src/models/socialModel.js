import pool from "../config/db.js";

export const createSocial = async (socialData, createdBy) => {
  const {
    patient_id,
    remarque,
    niveau_etude,
    nombre_enfants,
    ressources,
    activite_professionnelle,
    probleme,
    acces_soins,
    situation_familiale,
  } = socialData;

  const query = `
    INSERT INTO social (
      patient_id, remarque, niveau_etude, 
      nombre_enfants, ressources, activite_professionnelle,
      probleme, acces_soins, situation_familiale, created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;

  const values = [
    patient_id,
    remarque || null,
    niveau_etude || null,
    nombre_enfants || 0,
    ressources || null,
    activite_professionnelle || null,
    probleme || null,
    acces_soins || null,
    situation_familiale || null,
    createdBy,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getSocialById = async (id) => {
  const query = `
    SELECT 
      s.*,
      p.numero as patient_numero,
      p.name as patient_name,
      p.surname as patient_surname,
      u1.nom as created_by_nom, 
      u1.prenom as created_by_prenom,
      u2.nom as updated_by_nom, 
      u2.prenom as updated_by_prenom
    FROM social s
    LEFT JOIN patients p ON s.patient_id = p.id
    LEFT JOIN users u1 ON s.created_by = u1.id
    LEFT JOIN users u2 ON s.updated_by = u2.id
    WHERE s.id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const getSocialByPatientId = async (patientId) => {
  const query = `
    SELECT 
      s.*,
      p.numero as patient_numero,
      p.name as patient_name,
      p.surname as patient_surname,
      u1.nom as created_by_nom, 
      u1.prenom as created_by_prenom,
      u2.nom as updated_by_nom, 
      u2.prenom as updated_by_prenom
    FROM social s
    LEFT JOIN patients p ON s.patient_id = p.id
    LEFT JOIN users u1 ON s.created_by = u1.id
    LEFT JOIN users u2 ON s.updated_by = u2.id
    WHERE s.patient_id = $1;
  `;
  
  const result = await pool.query(query, [patientId]);
  return result.rows[0] || null;
};

export const checkSocialExists = async (patientId) => {
  const query = `
    SELECT COUNT(*) as count FROM social
    WHERE patient_id = $1
  `;
  const result = await pool.query(query, [patientId]);
  return parseInt(result.rows[0].count) > 0;
};


export const updateSocial = async (id, socialData, updatedBy) => {
  const {
    remarque,
    niveau_etude,
    nombre_enfants,
    ressources,
    activite_professionnelle,
    probleme,
    acces_soins,
    situation_familiale,
  } = socialData;

  const query = `
    UPDATE social
    SET 
      remarque = COALESCE($1, remarque),
      niveau_etude = COALESCE($3, niveau_etude),
      nombre_enfants = COALESCE($4, nombre_enfants),
      ressources = COALESCE($5, ressources),
      activite_professionnelle = COALESCE($6, activite_professionnelle),
      probleme = COALESCE($7, probleme),
      acces_soins = COALESCE($8, acces_soins),
      situation_familiale = COALESCE($9, situation_familiale),
      updated_by = $10
    WHERE id = $11
    RETURNING *;
  `;

  const values = [
    remarque,
    niveau_etude,
    nombre_enfants,
    ressources,
    activite_professionnelle,
    probleme,
    acces_soins,
    situation_familiale,
    updatedBy,
    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};
