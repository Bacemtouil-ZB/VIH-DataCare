//cheked 15/04/2026
import pool from "../../config/db.js";

export const getTherapeutic = async (numero) => {
  const result = await pool.query(
    `SELECT at.*
     FROM antecedent_therapeutic at
     JOIN patients p ON p.id = at.patient_id
     WHERE p.numero = $1;`,
    [numero],
  );
  return result.rows[0] || null;
};

export const createTherapeutic = async (client, numero, payload, userId) => {
  const {
    medicaments_chroniques,
    allergies_medicaments,
    remarque,
  } = payload;

  const result = await client.query(
    `
    INSERT INTO antecedent_therapeutic (
      patient_id,
      medicaments_chroniques, allergies_medicaments, remarque,
      created_by, updated_by
    )
    SELECT p.id, $2, $3, $4, $5, $5
    FROM patients p
    WHERE p.numero = $1
    RETURNING *;
    `,
    [
      numero,
      medicaments_chroniques ?? null,
      allergies_medicaments  ?? null,
      remarque               ?? null,
      userId,
    ],
  );
  return result.rows[0];
};

export const updateTherapeutic = async (client, numero, payload, userId) => {
  const {
    medicaments_chroniques,
    allergies_medicaments,
    remarque,
  } = payload;

  const result = await client.query(
    `
    UPDATE antecedent_therapeutic at
    SET
      medicaments_chroniques = $2,
      allergies_medicaments  = $3,
      remarque               = $4,
      updated_by             = $5,
      updated_at             = NOW()
    FROM patients p
    WHERE at.patient_id = p.id
      AND p.numero = $1
    RETURNING at.*;
    `,
    [
      numero,
      medicaments_chroniques ?? null,
      allergies_medicaments  ?? null,
      remarque               ?? null,
      userId,
    ],
  );
  return result.rows[0] || null;
};