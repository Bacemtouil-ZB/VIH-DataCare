import pool from "../../config/db.js";

export const getGyneco = async (numero) => {
  const result = await pool.query(
    `SELECT ag.*
     FROM antecedent_gyneco ag
     JOIN patients p ON p.id = ag.patient_id
     WHERE p.numero = $1;`,
    [numero],
  );
  return result.rows[0] || null;
};

export const createGyneco = async (client, numero, payload, userId) => {
  const {
    gestite,
    parite,
    avortement,
    complications,
    suivi_gynecologique,
    depistage_cancer_col,
    remarque,
  } = payload;

  const result = await client.query(
    `
    INSERT INTO antecedent_gyneco (
      patient_id,
      gestite, parite, avortement,
      complications, suivi_gynecologique, depistage_cancer_col, remarque,
      created_by, updated_by
    )
    SELECT p.id, $2, $3, $4, $5, $6, $7, $8, $9, $9
    FROM patients p
    WHERE p.numero = $1
    RETURNING *;
    `,
    [
      numero,
      gestite ?? null,
      parite ?? null,
      avortement ?? null,
      complications ?? null,
      suivi_gynecologique ?? null,
      depistage_cancer_col ?? null,
      remarque ?? null,
      userId,
    ],
  );
  return result.rows[0];
};

export const updateGyneco = async (client, numero, payload, userId) => {
  const {
    gestite,
    parite,
    avortement,
    complications,
    suivi_gynecologique,
    depistage_cancer_col,
    remarque,
  } = payload;

  const result = await client.query(
    `
    UPDATE antecedent_gyneco ag
    SET
      gestite              = $2,
      parite               = $3,
      avortement           = $4,
      complications        = $5,
      suivi_gynecologique  = $6,
      depistage_cancer_col = $7,
      remarque             = $8,
      updated_by           = $9,
      updated_at           = NOW()
    FROM patients p
    WHERE ag.patient_id = p.id
      AND p.numero = $1
    RETURNING ag.*;
    `,
    [
      numero,
      gestite ?? null,
      parite ?? null,
      avortement ?? null,
      complications ?? null,
      suivi_gynecologique ?? null,
      depistage_cancer_col ?? null,
      remarque ?? null,
      userId,
    ],
  );
  return result.rows[0] || null;
};