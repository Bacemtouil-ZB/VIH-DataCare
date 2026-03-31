import pool from "../../config/db.js";

export const getTpePrep = async (numero) => {
  const result = await pool.query(
    `SELECT tp.*
     FROM antecedent_tpe_prep tp
     JOIN patients p ON p.id = tp.patient_id
     WHERE p.numero = $1
     ORDER BY tp.created_at DESC;`,
    [numero],
  );
  return result.rows;
};

export const createTpePrep = async (client, numero, payload, userId) => {
  const {
    tpe_nom_traitement,
    tpe_date,
    prep_nom_traitement,
    prep_date,
    remarque,
  } = payload;

  const result = await client.query(
    `
    INSERT INTO antecedent_tpe_prep (
      patient_id,
      tpe_nom_traitement, tpe_date,
      prep_nom_traitement, prep_date,
      remarque, created_by
    )
    SELECT p.id, $2, $3, $4, $5, $6, $7
    FROM patients p
    WHERE p.numero = $1
    RETURNING *;
    `,
    [
      numero,
      tpe_nom_traitement ?? null,
      tpe_date ?? null,
      prep_nom_traitement ?? null,
      prep_date ?? null,
      remarque ?? null,
      userId,
    ],
  );
  return result.rows[0];
};

export const updateTpePrep = async (client, id, payload) => {
  const {
    tpe_nom_traitement,
    tpe_date,
    prep_nom_traitement,
    prep_date,
    remarque,
  } = payload;

  const result = await client.query(
    `
    UPDATE antecedent_tpe_prep
    SET
      tpe_nom_traitement  = $2,
      tpe_date            = $3,
      prep_nom_traitement = $4,
      prep_date           = $5,
      remarque            = $6
    WHERE id = $1
    RETURNING *;
    `,
    [
      id,
      tpe_nom_traitement ?? null,
      tpe_date ?? null,
      prep_nom_traitement ?? null,
      prep_date ?? null,
      remarque ?? null,
    ],
  );
  return result.rows[0] || null;
};

export const deleteTpePrep = async (client, id) => {
  await client.query(
    `DELETE FROM antecedent_tpe_prep WHERE id = $1;`,
    [id],
  );
};