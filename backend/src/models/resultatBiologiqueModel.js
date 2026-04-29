import pool from "../config/db.js";

const findPatientIdByNumero = async (numeroDossier) => {
  const result = await pool.query("SELECT id FROM patients WHERE numero = $1", [numeroDossier]);

  if (!result.rows[0]) {
    throw new Error("Patient non trouve");
  }

  return result.rows[0].id;
};

export const createResultat = async (data) => {
  const { numero_dossier, bilan_id, observations, date_resultat, ...resultFields } = data;

  const patientId = await findPatientIdByNumero(numero_dossier);
  const fieldKeys = Object.keys(resultFields);
  const fieldValues = Object.values(resultFields);

  const columns = ["patient_id", "bilan_id", "observations", "date_resultat", ...fieldKeys];
  const values = [
    patientId,
    bilan_id || null,
    observations || null,
    date_resultat || new Date().toISOString().slice(0, 10),
    ...fieldValues,
  ];

  const quotedColumns = columns.map((column) => `"${column}"`).join(", ");
  const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

  const query = `
    INSERT INTO resultats_biologiques (${quotedColumns})
    VALUES (${placeholders})
    RETURNING *;
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getResultatsByNumeroDossier = async (numeroDossier) => {
  const query = `
    SELECT rb.*
    FROM resultats_biologiques rb
    JOIN patients p ON rb.patient_id = p.id
    WHERE p.numero = $1
    ORDER BY rb.date_resultat DESC, rb.created_at DESC;
  `;

  const result = await pool.query(query, [numeroDossier]);
  return result.rows;
};

export const getDernierBilanPrescrit = async (numeroDossier) => {
  const query = `
    SELECT be.*
    FROM bilan_examens be
    JOIN patients p ON be.patient_id = p.id
    WHERE p.numero = $1
    ORDER BY be.created_at DESC
    LIMIT 1;
  `;

  const result = await pool.query(query, [numeroDossier]);
  return result.rows[0] || null;
};

export const getResultatById = async (id) => {
  const result = await pool.query("SELECT * FROM resultats_biologiques WHERE id = $1", [id]);
  return result.rows[0] || null;
};

export const updateResultat = async (id, data) => {
  const { observations, date_resultat, ...resultFields } = data;

  const fieldKeys = Object.keys(resultFields);
  const fieldValues = Object.values(resultFields);

  const setParts = fieldKeys.map((field, index) => `"${field}" = $${index + 1}`);
  const observationsIndex = fieldValues.length + 1;
  const dateResultatIndex = fieldValues.length + 2;
  const idIndex = fieldValues.length + 3;

  setParts.push(`observations = $${observationsIndex}`);
  setParts.push(`date_resultat = $${dateResultatIndex}`);
  setParts.push("updated_at = NOW()");

  const query = `
    UPDATE resultats_biologiques
    SET ${setParts.join(", ")}
    WHERE id = $${idIndex}
    RETURNING *;
  `;

  const params = [
    ...fieldValues,
    observations || null,
    date_resultat || null,
    id,
  ];

  const result = await pool.query(query, params);
  return result.rows[0] || null;
};
