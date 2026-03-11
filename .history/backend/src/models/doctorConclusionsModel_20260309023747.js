import pool from "../config/db.js";

/* CREATE */
export const createConclusion = async ({ numero, doctor_id, content }) => {
  const query = `
    INSERT INTO doctor_conclusions (patient_id, doctor_id, content)
    SELECT id, $1, $2
    FROM patients
    WHERE numero = $3
    RETURNING id, patient_id, doctor_id, content, created_at, updated_at
  `;

  const values = [doctor_id, content, numero];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

/* LIST CONCLUSIONS BY PATIENT NUMERO */
// export const getConclusionsByPatient = async ({ numero, limit, offset }) => {
//   const query = `
//     SELECT dc.id, dc.patient_id, dc.doctor_id, dc.content, dc.created_at, dc.updated_at
//     FROM doctor_conclusions dc
//     JOIN patients p ON dc.patient_id = p.id
//     WHERE p.numero = $1
//     ORDER BY dc.created_at DESC
//     LIMIT $2 OFFSET $3
//   `;

//   const values = [numero, limit, offset];
//   const { rows } = await pool.query(query, values);
//   return rows;
// };

/* COUNT CONCLUSIONS */
export const countConclusionsByPatient = async ({ numero }) => {
  const query = `
    SELECT COUNT(*)::int AS total
    FROM doctor_conclusions dc
    JOIN patients p ON dc.patient_id = p.id
    WHERE p.numero = $1
  `;

  const { rows } = await pool.query(query, [numero]);
  return rows[0]?.total ?? 0;
};

/* GET BY ID */
// export const getConclusionById = async ({ id }) => {
//   const query = `
//     SELECT id, patient_id, doctor_id, content, created_at, updated_at
//     FROM doctor_conclusions
//     WHERE id = $1
//   `;

//   const { rows } = await pool.query(query, [id]);
//   return rows[0] || null;
// };

/* UPDATE */
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

export const getConclusionsByPatient = async ({ numero, limit, offset }) => {
  const query = `
    SELECT 
      dc.id, dc.patient_id, dc.doctor_id, dc.content, dc.created_at, dc.updated_at,
      u.nom || ' ' || u.prenom AS doctor_name
    FROM doctor_conclusions dc
    JOIN patients p ON dc.patient_id = p.id
    JOIN users u ON dc.doctor_id = u.id
    WHERE p.numero = $1
    ORDER BY dc.created_at DESC
    LIMIT $2 OFFSET $3
  `;
  const { rows } = await pool.query(query, [numero, limit, offset]);
  return rows;
};

export const getConclusionById = async ({ id }) => {
  const query = `
    SELECT 
      dc.id, dc.patient_id, dc.doctor_id, dc.content, dc.created_at, dc.updated_at,
      u.nom || ' ' || u.prenom AS doctor_name
    FROM doctor_conclusions dc
    JOIN users u ON dc.doctor_id = u.id
    WHERE dc.id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};
