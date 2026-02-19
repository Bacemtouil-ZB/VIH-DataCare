import pool from "../config/db.js";
export const createPatient = async (patientData, createdBy) => {
  console.log("patientData reçu:", patientData);
  const {
    numero,
    name,
    surname,
    birthdate,
    gender,
    birth_postal_code_id,
    residence_postal_code_id,
    residence_exact_address,
    phone,
    hospitalisation,
    doctor_id,
    remarques,
  } = patientData;

  const query = `
    INSERT INTO patients (
      numero, name, surname, birthdate, gender,
      birth_postal_code_id, residence_postal_code_id, residence_exact_address,
      phone, hospitalisation, doctor_id, remarques, created_by
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING *;
  `;

  const values = [
    numero,
    name,
    surname,
    birthdate,
    gender,
    birth_postal_code_id || null,
    residence_postal_code_id || null,
    residence_exact_address || null,
    phone,
    hospitalisation,
    doctor_id || null,
    remarques || null,
    createdBy || null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};
export const getPatientById = async (id) => {
  const query = `
    SELECT
      p.*,
      b.governorate AS birth_governorate,
      b.code_postal AS birth_code_postal,
      r.governorate AS res_governorate,
      r.code_postal AS res_code_postal,
      u1.nom as created_by_nom,
      u1.prenom as created_by_prenom,
      u2.nom as updated_by_nom,
      u2.prenom as updated_by_prenom
    FROM patients p
    LEFT JOIN addresses b ON p.birth_address_id = b.id
    LEFT JOIN addresses r ON p.residence_address_id = r.id
    LEFT JOIN users u1 ON p.created_by_name = u1.id
    LEFT JOIN users u2 ON p.updated_by_name = u2.id
    WHERE p.id = $1;
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const getPatientByNumero = async (numero) => {
  const query = `
    SELECT 
      p.*,
      b.governorate AS birth_governorate,
      b.code_postal AS birth_code_postal,
      r.governorate AS res_governorate,
      r.code_postal AS res_code_postal,
      u1.nom as created_by_nom, 
      u1.prenom as created_by_prenom,
      u2.nom as updated_by_nom, 
      u2.prenom as updated_by_prenom
    FROM patients p
    LEFT JOIN addresses b ON p.birth_address_id = b.id
    LEFT JOIN addresses r ON p.residence_address_id = r.id
    LEFT JOIN users u1 ON p.created_by_name = u1.id
    LEFT JOIN users u2 ON p.updated_by_name = u2.id
    WHERE p.numero_dossier = $1;
  `;

  const result = await pool.query(query, [numero]);
  return result.rows[0] || null;
};


export const checkNumeroExists = async (numero) => {
  const query = `
    SELECT COUNT(*) as count FROM patients
    WHERE numero = $1
  `;
  const result = await pool.query(query, [numero]);
  return parseInt(result.rows[0].count) > 0;
};


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
  `;

  const values = [];
  let paramCount = 1;

  query += ` ORDER BY p.created_at ${options.sortOrder || "DESC"}`;

  const result = await pool.query(query, values);
  return result.rows;
};

 const updatePatient = async (id, patientData, updatedBy) => {
  const {
    numero,
    name,
    surname,
    birthdate,
    gender,
    birth_address_id,
    residence_address_id,
    exact_address,
    phone,
    hospitalisation,
    last_visit_date,
    doctor_id,
    remarques,
  } = patientData;

  const query = `
    UPDATE patients
    SET 
      numero_dossier = COALESCE($1, numero_dossier),
      name = COALESCE($2, name),
      surname = COALESCE($3, surname),
      birthdate = COALESCE($4, birthdate),
      gender = COALESCE($5, gender),
      birth_address_id = COALESCE($6, birth_address_id),
      residence_address_id = COALESCE($7, residence_address_id),
      exact_address = COALESCE($8, exact_address),
      phone = COALESCE($9, phone),
      hospitalisation = COALESCE($10, hospitalisation),
      last_visit_date = COALESCE($11, last_visit_date),
      doctor_id = COALESCE($12, doctor_id),
      remarques = COALESCE($13, remarques),
      updated_by_name = $14,
      updated_at = NOW()
    WHERE id = $15
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
    exact_address,
    phone,
    hospitalisation,
    last_visit_date,
    doctor_id,
    remarques,
    updatedBy,
    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const countPatients = async () => {
  const query = `SELECT COUNT(*) as count FROM patients`;
  const result = await pool.query(query);
  return parseInt(result.rows[0].count);
};

