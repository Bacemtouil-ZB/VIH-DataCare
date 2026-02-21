import pool from "../config/db.js";

export const createSigneClinique = async (signeData) => {
  const { examen_clinique_id, poids, taille, imc } = signeData;

  const query = `
    INSERT INTO signes_cliniques (examen_clinique_id, poids, taille, imc)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [examen_clinique_id, poids || null, taille || null, imc || null];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getSigneCliniqueById = async (id) => {
  const query = `SELECT * FROM signes_cliniques WHERE id = $1;`;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const getSigneCliniqueByNumeroDossier = async (numeroDossier) => {
  const query = `
    SELECT sc.*
    FROM signes_cliniques sc
    JOIN examen_clinique ec ON sc.examen_clinique_id = ec.id
    JOIN patients p ON ec.numero_dossier = p.numero
    WHERE p.numero = $1
   ;
  `;

  const result = await pool.query(query, [numeroDossier]);
  return result.rows;
};

export const updateSigneClinique = async (id, signeData) => {
  const { poids, taille, imc } = signeData;

  const query = `
    UPDATE signes_cliniques
    SET
      poids = COALESCE($1, poids),
      taille = COALESCE($2, taille),
      imc = COALESCE($3, imc)
    WHERE id = $4
    RETURNING *;
  `;

  const values = [poids || null, taille || null, imc || null, id];

  const result = await pool.query(query, values);
  return result.rows[0];
};