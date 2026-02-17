import pool from "../config/db.js";

export const createVih = async (vihData, createdBy) => {
  const {
    patient_id,
    mode_contamination,
    type_depistage,
    circonstance_decouverte,
    date_derniere_negative,
    date_contamination,
    date_vih_positif,
    stade_cdc,
    debut_stade_c,
    typage_hla_b5701,
    profil_seroconversion,
  } = vihData;

  const query = `
    INSERT INTO vih (
      patient_id, mode_contamination, type_depistage, circonstance_decouverte,
      date_derniere_negative, date_contamination, date_vih_positif, stade_cdc,
      debut_stade_c, typage_hla_b5701, profil_seroconversion, created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *;
  `;

  const values = [
    patient_id,
    mode_contamination,
    type_depistage,
    circonstance_decouverte,
    date_derniere_negative,
    date_contamination,
    date_vih_positif,
    stade_cdc,
    debut_stade_c,
    typage_hla_b5701,
    profil_seroconversion,
    createdBy,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * Récupère un dossier VIH par son ID
 */
export const getVihById = async (id) => {
  const query = `
    SELECT 
      v.*,
      p.name as patient_name,
      p.surname as patient_surname,
      u1.nom as created_by_nom,
      u1.prenom as created_by_prenom,
      u2.nom as updated_by_nom,
      u2.prenom as updated_by_prenom
    FROM vih v
    LEFT JOIN patients p ON v.patient_id = p.id
    LEFT JOIN users u1 ON v.created_by = u1.id
    LEFT JOIN users u2 ON v.updated_by = u2.id
    WHERE v.id = $1;
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const getVihByPatientId = async (patientId) => {
  const query = `
    SELECT 
      v.*,
      p.name as patient_name,
      p.surname as patient_surname,
      u1.nom as created_by_nom,
      u1.prenom as created_by_prenom,
      u2.nom as updated_by_nom,
      u2.prenom as updated_by_prenom
    FROM vih v
    LEFT JOIN patients p ON v.patient_id = p.id
    LEFT JOIN users u1 ON v.created_by = u1.id
    LEFT JOIN users u2 ON v.updated_by = u2.id
    WHERE v.patient_id = $1;
  `;

  const result = await pool.query(query, [patientId]);
  return result.rows[0] || null;
};

export const updateVih = async (id, vihData, updatedBy) => {
  const {
    mode_contamination,
    type_depistage,
    circonstance_decouverte,
    date_derniere_negative,
    date_contamination,
    date_vih_positif,
    stade_cdc,
    debut_stade_c,
    typage_hla_b5701,
    profil_seroconversion,
  } = vihData;

  const query = `
    UPDATE vih
    SET 
      mode_contamination = COALESCE($1, mode_contamination),
      type_depistage = COALESCE($2, type_depistage),
      circonstance_decouverte = COALESCE($3, circonstance_decouverte),
      date_derniere_negative = COALESCE($4, date_derniere_negative),
      date_contamination = COALESCE($5, date_contamination),
      date_vih_positif = COALESCE($6, date_vih_positif),
      stade_cdc = COALESCE($7, stade_cdc),
      debut_stade_c = COALESCE($8, debut_stade_c),
      typage_hla_b5701 = COALESCE($9, typage_hla_b5701),
      profil_seroconversion = COALESCE($10, profil_seroconversion),
      updated_by = $11
    WHERE id = $12
    RETURNING *;
  `;

  const values = [
    mode_contamination,
    type_depistage,
    circonstance_decouverte,
    date_derniere_negative,
    date_contamination,
    date_vih_positif,
    stade_cdc,
    debut_stade_c,
    typage_hla_b5701,
    profil_seroconversion,
    updatedBy,
    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const checkVihExistsForPatient = async (patientId) => {
  const query = `
    SELECT COUNT(*) as count FROM vih
    WHERE patient_id = $1;
  `;
  const result = await pool.query(query, [patientId]);
  return parseInt(result.rows[0].count) > 0;
};
export const getVihHistoryByPatientId = async (patientId) => {
  const query = `
    SELECT 
      v.id,
      v.mode_contamination,
      v.type_depistage,
      v.circonstance_decouverte,
      v.date_derniere_negative,
      v.date_contamination,
      v.date_vih_positif,
      v.stade_cdc,
      v.debut_stade_c,
      v.typage_hla_b5701,
      v.profil_seroconversion,
      v.created_at,
      v.updated_at,
      u1.nom as created_by_nom,
      u1.prenom as created_by_prenom,
      u2.nom as updated_by_nom,
      u2.prenom as updated_by_prenom
    FROM vih v
    LEFT JOIN users u1 ON v.created_by = u1.id
    LEFT JOIN users u2 ON v.updated_by = u2.id
    WHERE v.patient_id = $1
    ORDER BY v.updated_at DESC, v.created_at DESC;
  `;

  const result = await pool.query(query, [patientId]);
  return result.rows;
};