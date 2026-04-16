//cheked 15/04/2026
import pool from "../../config/db.js";

export const getTransfusion = async (numero) => {
  const result = await pool.query(
    `SELECT t.*
     FROM antecedent_transfusion t
     JOIN patients p ON p.id = t.patient_id
     WHERE p.numero = $1
     ORDER BY t.created_at DESC;`,
    [numero],
  );
  return result.rows;
};

export const createTransfusion = async (client, numero, payload, userId) => {
  const { date_transfusion, remarque } = payload;

  const result = await client.query(
    `
    INSERT INTO antecedent_transfusion (patient_id, date_transfusion, remarque, created_by)
    SELECT p.id, $2, $3, $4
    FROM patients p
    WHERE p.numero = $1
    RETURNING *;
    `,
    [
      numero,
      date_transfusion ?? null,
      remarque ?? null,
      userId,
    ],
  );
  return result.rows[0];
};

export const updateTransfusion = async (client, id, payload) => {
  const { date_transfusion, remarque } = payload;

  const result = await client.query(
    `
    UPDATE antecedent_transfusion
    SET
      date_transfusion = $2,
      remarque         = $3
    WHERE id = $1
    RETURNING *;
    `,
    [
      id,
      date_transfusion ?? null,
      remarque ?? null,
    ],
  );
  return result.rows[0] || null;
};

export const deleteTransfusion = async (client, id) => {
  await client.query(
    `DELETE FROM antecedent_transfusion WHERE id = $1;`,
    [id],
  );
};