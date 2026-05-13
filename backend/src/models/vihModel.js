
import pool from "../config/db.js";

export const createVih = async (vihData, createdBy) => {
  const {
    patient_id,
    mode_contamination,
    type_depistage,
    circonstance_decouverte,
    date_derniere_negative,
    date_vih_positif,
    stade_cdc,
    
  } = vihData;

  const query = `
    INSERT INTO vih (
      patient_id, mode_contamination, type_depistage, circonstance_decouverte,
      date_derniere_negative, date_vih_positif, stade_cdc,
        created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING
      id,
      patient_id,
      mode_contamination,
      type_depistage,
      circonstance_decouverte,
      date_derniere_negative::text AS date_derniere_negative,
      date_vih_positif::text AS date_vih_positif,
      stade_cdc,
      created_by,
      updated_by,
      created_at,
      updated_at;
  `;

  const values = [
    patient_id,
    mode_contamination || null,
    type_depistage || null,
    circonstance_decouverte || null,
    date_derniere_negative || null,
    date_vih_positif || null,
    stade_cdc || null,
    createdBy,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getVihById = async (id) => {
  const query = `
    SELECT 
      v.id,
      v.patient_id,
      v.mode_contamination,
      v.type_depistage,
      v.circonstance_decouverte,
      v.date_derniere_negative::text AS date_derniere_negative,
      v.date_vih_positif::text AS date_vih_positif,
      v.stade_cdc,
      v.created_by,
      v.updated_by,
      v.created_at,
      v.updated_at,
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

export const getVihByNumeroDossier = async (numero) => {
  const query = `
    SELECT 
      v.id,
      v.patient_id,
      v.mode_contamination,
      v.type_depistage,
      v.circonstance_decouverte,
      v.date_derniere_negative::text AS date_derniere_negative,
      v.date_vih_positif::text AS date_vih_positif,
      v.stade_cdc,
      v.created_by,
      v.updated_by,
      v.created_at,
      v.updated_at,
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
    WHERE p.numero = $1
    ;
  `;

  const result = await pool.query(query, [numero]);
  return result.rows[0] || null;
};

export const updateVih = async (id, vihData, updatedBy) => {
  const {
    mode_contamination,
    type_depistage,
    circonstance_decouverte,
    date_derniere_negative,
    date_vih_positif,
    stade_cdc,
    typage_hla_b5701,
    
  } = vihData;

  const query = `
    UPDATE vih
    SET 
      mode_contamination = COALESCE($1, mode_contamination),
      type_depistage = COALESCE($2, type_depistage),
      circonstance_decouverte = COALESCE($3, circonstance_decouverte),
      date_derniere_negative = $4,
      date_vih_positif = COALESCE($5, date_vih_positif),
      stade_cdc = COALESCE($6, stade_cdc),
      updated_by = $7,
      updated_at = NOW()
    WHERE id = $8
    RETURNING
      id,
      patient_id,
      mode_contamination,
      type_depistage,
      circonstance_decouverte,
      date_derniere_negative::text AS date_derniere_negative,
      date_vih_positif::text AS date_vih_positif,
      stade_cdc,
      created_by,
      updated_by,
      created_at,
      updated_at;
  `;

  const values = [
    mode_contamination || null,
    type_depistage || null,
    circonstance_decouverte || null,
    date_derniere_negative || null,
    date_vih_positif || null,
    stade_cdc || null,
    updatedBy,
    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};
