//cheked 15/04/2026
import pool from "../../config/db.js";

export const getSurgical = async (numero) => {
  const result = await pool.query(
    `SELECT s.*
     FROM antecedent_surgical s
     JOIN patients p ON p.id = s.patient_id
     WHERE p.numero = $1
     ORDER BY s.created_at DESC;`,
    [numero]
  );
  return result.rows;
};

export const createSurgical = async (client, numero, payload, userId) => {
  const { description, date_intervention, remarque } = payload;

  const result = await client.query(
    `
    INSERT INTO antecedent_surgical (patient_id, description, date_intervention, remarque, created_by)
    SELECT p.id, $2, $3, $4, $5
    FROM patients p
    WHERE p.numero = $1
    RETURNING *;
    `,
    [
      numero,
      description ?? null,
      date_intervention ?? null,
      remarque ?? null,
      userId,
    ]
  );
  return result.rows[0];
};

export const updateSurgical = async (client, id, payload) => {
  const { description, date_intervention, remarque } = payload;

  const result = await client.query(
    `
    UPDATE antecedent_surgical
    SET
      description       = $2,
      date_intervention = $3,
      remarque          = $4
    WHERE id = $1
    RETURNING *;
    `,
    [
      id,
      description ?? null,
      date_intervention ?? null,
      remarque ?? null,
    ]
  );
  return result.rows[0] || null;
};

export const deleteSurgical = async (client, id) => {
  await client.query(
    `DELETE FROM antecedent_surgical WHERE id = $1;`,
    [id]
  );
};