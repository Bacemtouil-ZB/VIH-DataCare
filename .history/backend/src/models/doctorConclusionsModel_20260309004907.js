import pool from "../config/db.js";

export const createConclusion = async ({ patient_id, doctor_id, content }) => {
  const query = `
    INSERT INTO doctor_conclusions (patient_id, doctor_id, content)
    VALUES ($1, $2, $3)
    RETURNING id, patient_id, doctor_id, content, created_at, updated_at
  `;
  const values = [patient_id, doctor_id, content];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getConclusionsByPatient = async ({
  patient_id,
  limit,
  offset,
}) => {
  const query = `
    SELECT id, patient_id, doctor_id, content, created_at, updated_at
    FROM doctor_conclusions
    WHERE patient_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `;
  const values = [patient_id, limit, offset];
  const { rows } = await pool.query(query, values);
  return rows;
};

export const countConclusionsByPatient = async ({ patient_id }) => {
  const query = `SELECT COUNT(*)::int AS total FROM doctor_conclusions WHERE patient_id = $1`;
  const { rows } = await pool.query(query, [patient_id]);
  return rows[0]?.total ?? 0;
};

export const getConclusionById = async ({ id }) => {
  const query = `
    SELECT id, patient_id, doctor_id, content, created_at, updated_at
    FROM doctor_conclusions
    WHERE id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};

export const updateConclusion = async ({ id, doctor_id, content }) => {
  const query = `
    UPDATE doctor_conclusions
    SET content = $3, updated_at = NOW()
    WHERE id = $1 AND doctor_id = $2
    RETURNING id, patient_id, doctor_id, content, created_at, updated_at
  `;
  const values = [id, doctor_id, content];
  const { rows } = await pool.query(query, values);
  return rows[0] || null;
};
