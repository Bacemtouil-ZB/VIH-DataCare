// Using pg/pool style (adapt to your existing db helper)
import db from "../db/index.js";

/**
 * Create conclusion
 */
export async function createConclusion({ patientId, doctorId, content }) {
  const q = `
    INSERT INTO doctor_conclusions (patient_id, doctor_id, content)
    VALUES ($1, $2, $3)
    RETURNING id, patient_id, doctor_id, content, created_at, updated_at
  `;
  const { rows } = await db.query(q, [patientId, doctorId, content]);
  return rows[0];
}

export async function updateConclusion({ id, doctorId, content }) {
  const q = `
    UPDATE doctor_conclusions
    SET content = $3
    WHERE id = $1 AND doctor_id = $2
    RETURNING id, patient_id, doctor_id, content, created_at, updated_at
  `;
  const { rows } = await db.query(q, [id, doctorId, content]);
  return rows[0] || null;
}

export async function getConclusionById({ id }) {
  const q = `
    SELECT id, patient_id, doctor_id, content, created_at, updated_at
    FROM doctor_conclusions
    WHERE id = $1
  `;
  const { rows } = await db.query(q, [id]);
  return rows[0] || null;
}

export async function listConclusionsByPatient({ patientId, limit, offset }) {
  const q = `
    SELECT id, patient_id, doctor_id, content, created_at, updated_at
    FROM doctor_conclusions
    WHERE patient_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `;
  const { rows } = await db.query(q, [patientId, limit, offset]);
  return rows;
}

export async function countConclusionsByPatient({ patientId }) {
  const q = `SELECT COUNT(*)::int AS total FROM doctor_conclusions WHERE patient_id = $1`;
  const { rows } = await db.query(q, [patientId]);
  return rows[0]?.total ?? 0;
}
