//cheked 15/04/2026
import pool from "../../config/db.js";

export const createObservation = async (examenCliniqueId, remarque) => {
  const query = `
    INSERT INTO observations (examen_clinique_id, remarque)
    VALUES ($1, $2)
    RETURNING *,
      (SELECT ec.patient_id FROM examen_clinique ec WHERE ec.id = observations.examen_clinique_id) AS patient_id;
  `;
  const result = await pool.query(query, [examenCliniqueId, remarque]);
  return result.rows[0];
};

export const getObservationsByNumeroDossier = async (numeroDossier) => {
  const query = `
    SELECT o.*, o.created_at AS date_examen, ec.patient_id
    FROM observations o
    JOIN examen_clinique ec ON o.examen_clinique_id = ec.id
    JOIN patients p ON ec.patient_id = p.id
    WHERE p.numero = $1
    ORDER BY o.created_at DESC;
  `;
  const result = await pool.query(query, [numeroDossier]);
  return result.rows;
};

export const updateObservation = async (id, remarque) => {
  const query = `
    UPDATE observations
    SET remarque = $1,
        updated_at = NOW()
    WHERE id = $2
    RETURNING *,
      (SELECT ec.patient_id FROM examen_clinique ec WHERE ec.id = observations.examen_clinique_id) AS patient_id;
  `;
  const result = await pool.query(query, [remarque, id]);
  return result.rows[0];
};
