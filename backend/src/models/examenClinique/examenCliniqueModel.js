import pool from "../../config/db.js";


export const createExamenClinique = async (examenData, medecinId) => {
  const { patient_id, date_examen } = examenData;

  const query = `
    INSERT INTO examen_clinique (
      patient_id,
      date_examen,
      medecin_id
    )
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [
    patient_id,
    date_examen || new Date(),
    medecinId
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getExamensByNumeroDossier = async (numero) => {
  const query = `
    SELECT 
      ec.*,
      u.nom as medecin_nom,
      u.prenom as medecin_prenom,
      p.numero as patient_numero,
      p.name as patient_name,
      p.surname as patient_surname
    FROM examen_clinique ec
    INNER JOIN patients p ON ec.patient_id = p.id
    LEFT JOIN users u ON ec.medecin_id = u.id
    WHERE p.numero = $1
    ORDER BY ec.date_examen DESC;
  `;

  const result = await pool.query(query, [numero]);
  return result.rows;
};

export const updateExamenClinique = async (id, examenData) => {
  const { date_examen } = examenData;

  const query = `
    UPDATE examen_clinique
    SET 
      date_examen = COALESCE($1, date_examen),
      updated_at = NOW()
    WHERE id = $2
    RETURNING *;
  `;

  const values = [date_examen, id];

  const result = await pool.query(query, values);
  return result.rows[0];
};
