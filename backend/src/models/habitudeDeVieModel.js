import pool from "../config/db.js";

export const createHabitudeDeVie = async (habitudeData, createdBy) => {
  const {
    examen_clinique_id,
    tabagisme,
    alcoolemie,
    toxicomanie,
    activite_physique,
  } = habitudeData;

  const query = `
    INSERT INTO habitudes_vie (
      examen_clinique_id,
      tabagisme,
      alcoolemie,
      toxicomanie,
      activite_physique,
      created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    examen_clinique_id,
    tabagisme || false,
    alcoolemie || false,
    toxicomanie || false,
    activite_physique || false,
    createdBy,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};


export const getHabitudeDeVieById = async (id) => {
  const query = `
    SELECT 
      h.*,
      ec.date_examen
    FROM habitudes_vie h
    LEFT JOIN examen_clinique ec ON h.examen_clinique_id = ec.id
    WHERE h.id = $1;
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const getHabitudeDeVieByNumeroDossier = async (numero) => {
  const query = `
    SELECT 
      h.*,
      ec.date_examen
    FROM habitudes_vie h
    LEFT JOIN examen_clinique ec ON h.examen_clinique_id = ec.id
    LEFT JOIN patients p ON ec.patient_id = p.id
    WHERE p.numero = $1
    ORDER BY ec.date_examen DESC;
  `;

  const result = await pool.query(query, [numero]);
  return result.rows; // Retourne un tableau
};


export const updateHabitudeDeVie = async (id, habitudeData, updatedBy) => {
  const {
    tabagisme,
    alcoolemie,
    toxicomanie,
    activite_physique,
  } = habitudeData;

  const query = `
    UPDATE habitudes_vie
    SET 
      tabagisme = COALESCE($1, tabagisme),
      alcoolemie = COALESCE($2, alcoolemie),
      toxicomanie = COALESCE($3, toxicomanie),
      activite_physique = COALESCE($4, activite_physique),
      updated_by = $5,
      updated_at = NOW()
    WHERE id = $6
    RETURNING *;
  `;

  const values = [
    tabagisme,
    alcoolemie,
    toxicomanie,
    activite_physique,
    updatedBy,
    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};