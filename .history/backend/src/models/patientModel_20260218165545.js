import pool from "../config/db.js";

// CREATE
export const createPatient = async (patientData, createdBy) => {
  const {
    numero,
    name,
    surname,
    birthdate,
    gender,
    birth_address_id,
    residence_address_id,
    phone,
    hospitalisation,
    last_visit_date,
  } = patientData;

  const query = `
    INSERT INTO patients (
      numero, name, surname, birthdate, gender,
      birth_address_id, residence_address_id,
      phone, hospitalisation, last_visit_date,
      created_by, updated_by
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING *;
  `;

  const values = [
    numero,
    name,
    surname,
    birthdate,
    gender,
    birth_address_id ,
    residence_address_id ,
    phone,
    hospitalisation,
    last_visit_date || null,
    createdBy,
    createdBy,
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    if (err.code === "23505")
      throw new Error("Ce numéro de patient existe déjà.");
    if (err.code === "23514")
      throw new Error("Valeur invalide pour gender ou hospitalisation.");
    throw err;
  }
};

// GET BY ID
export const getPatientById = async (id) => {
  const query = `
    SELECT
      p.*,
      b.governorate AS birth_governorate,
      b.code_postal AS birth_code_postal,
      r.governorate AS res_governorate,
      r.code_postal AS res_code_postal,
      u1.nom AS created_by_nom,
      u1.prenom AS created_by_prenom,
      u2.nom AS updated_by_nom,
      u2.prenom AS updated_by_prenom
    FROM patients p
    LEFT JOIN addresses b ON p.birth_address_id = b.id
    LEFT JOIN addresses r ON p.residence_address_id = r.id
    LEFT JOIN users u1 ON p.created_by = u1.id
    LEFT JOIN users u2 ON p.updated_by = u2.id
    WHERE p.id = $1;
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

// GET BY NUMERO
export const getPatientByNumero = async (numero) => {
  const query = `
    SELECT
      p.*,
      b.governorate AS birth_governorate,
      b.code_postal AS birth_code_postal,
      r.governorate AS res_governorate,
      r.code_postal AS res_code_postal,
      u1.nom AS created_by_nom,
      u1.prenom AS created_by_prenom,
      u2.nom AS updated_by_nom,
      u2.prenom AS updated_by_prenom
    FROM patients p
    LEFT JOIN addresses b ON p.birth_address_id = b.id
    LEFT JOIN addresses r ON p.residence_address_id = r.id
    LEFT JOIN users u1 ON p.created_by = u1.id
    LEFT JOIN users u2 ON p.updated_by = u2.id
    WHERE p.numero = $1;
  `;

  const result = await pool.query(query, [numero]);
  return result.rows[0] || null;
};

// CHECK NUMERO EXIST
export const checkNumeroExists = async (numero) => {
  const query = `SELECT COUNT(*) as count FROM patients WHERE numero = $1`;
  const result = await pool.query(query, [numero]);
  return parseInt(result.rows[0].count) > 0;
};

// GET ALL
export const getAllPatients = async (options = {}) => {
  let query = `
    SELECT 
      p.*,
      b.governorate AS birth_governorate,
      b.code_postal AS birth_code_postal,
      r.governorate AS res_governorate,
      r.code_postal AS res_code_postal
    FROM patients p
    LEFT JOIN addresses b ON p.birth_address_id = b.id
    LEFT JOIN addresses r ON p.residence_address_id = r.id
    WHERE 1=1
    ORDER BY p.created_at ${options.sortOrder || "DESC"}
  `;

  const result = await pool.query(query);
  return result.rows;
};

// UPDATE
export const updatePatient = async (id, patientData, updatedBy) => {
  const {
    numero,
    name,
    surname,
    birthdate,
    gender,
    birth_address_id,
    residence_address_id,
    phone,
    hospitalisation,
    last_visit_date,
  } = patientData;

  const query = `
    UPDATE patients
    SET 
      numero = COALESCE($1, numero),
      name = COALESCE($2, name),
      surname = COALESCE($3, surname),
      birthdate = COALESCE($4, birthdate),
      gender = COALESCE($5, gender),
      birth_address_id = COALESCE($6, birth_address_id),
      residence_address_id = COALESCE($7, residence_address_id),
      phone = COALESCE($8, phone),
      hospitalisation = COALESCE($9, hospitalisation),
      last_visit_date = COALESCE($10, last_visit_date),
      updated_by = $11,
      updated_at = NOW()
    WHERE id = $12
    RETURNING *;
  `;

  const values = [
    numero,
    name,
    surname,
    birthdate,
    gender,
    birth_address_id,
    residence_address_id,
    phone,
    hospitalisation,
    last_visit_date || null,
    updatedBy,
    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// COUNT
export const countPatients = async () => {
  const query = `SELECT COUNT(*) as count FROM patients`;
  const result = await pool.query(query);
  return parseInt(result.rows[0].count);
};
