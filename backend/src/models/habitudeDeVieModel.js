import pool from "../config/db.js";

export const createHabitudeDeVie = async (habitudeData) => {
  const { examen_clinique_id, tabagisme, alcoolemie, toxicomanie, activite_physique } = habitudeData;

  const query = `
    INSERT INTO habitudes_vie (examen_clinique_id, tabagisme, alcoolemie, toxicomanie, activite_physique)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [
    examen_clinique_id,
    tabagisme         || false,
    alcoolemie        || false,
    toxicomanie       || false,
    activite_physique || false,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getHabitudeDeVieById = async (id) => {
  const query = `SELECT * FROM habitudes_vie WHERE id = $1;`;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const getHabitudeDeVieByNumeroDossier = async (numeroDossier) => {
  const query = `
    SELECT hv.*
    FROM habitudes_vie hv
    JOIN examen_clinique ec ON hv.examen_clinique_id = ec.id
    JOIN patients p ON ec.numero_dossier = p.numero
    WHERE p.numero = $1
    ORDER BY hv.created_at DESC;
  `;

  const result = await pool.query(query, [numeroDossier]);
  return result.rows;
};

export const updateHabitudeDeVie = async (id, habitudeData) => {
  const { tabagisme, alcoolemie, toxicomanie, activite_physique } = habitudeData;

  const query = `
    UPDATE habitudes_vie
    SET
      tabagisme         = COALESCE($1, tabagisme),
      alcoolemie        = COALESCE($2, alcoolemie),
      toxicomanie       = COALESCE($3, toxicomanie),
      activite_physique = COALESCE($4, activite_physique)
    WHERE id = $5
    RETURNING *;
  `;

  const values = [
    tabagisme         || null,
    alcoolemie        || null,
    toxicomanie       || null,
    activite_physique || null,
    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};