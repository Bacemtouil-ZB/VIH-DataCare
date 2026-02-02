import pool from "../config/db.js";

export const createPatient = async (patientData, createdBy) => {
  const {
    name,
    surname,
    birthdate,
    gender,
    city,
    state,
    postalcode,
    nationality,
    height,
    modeoftransmission,
    maritalstatus,
    numberchildren,
    educationlevel,
    housing
  } = patientData;

  const query = `
    INSERT INTO patients (
      name, surname, birthdate, gender, city, state, postalcode,
      nationality, height, modeoftransmission, maritalstatus,
      numberchildren, educationlevel, housing, created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *;
  `;

  const values = [
    name, surname, birthdate, gender, city, state, postalcode,
    nationality, height, modeoftransmission, maritalstatus,
    numberchildren, educationlevel, housing, createdBy
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};


 // Récupère un patient par son ID:

export const getPatientById = async (id) => {
  const query = `
    SELECT p.*, 
           u1.nom as created_by_nom, u1.prenom as created_by_prenom,
           u2.nom as updated_by_nom, u2.prenom as updated_by_prenom
    FROM patients p
    LEFT JOIN users u1 ON p.created_by = u1.id
    LEFT JOIN users u2 ON p.updated_by = u2.id
    WHERE p.id = $1;
  `;
  const values = [id];

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};


// Récupère tous les patients avec pagination et filtres:
export const getAllPatients = async () => {
  const query = `
    SELECT * FROM patients
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Met à jour un patient:

export const updatePatient = async (id, patientData, updatedBy) => {
  const {
    name, surname, birthdate, gender, city, state, postalcode,
    nationality, height, modeoftransmission, maritalstatus,
    numberchildren, educationlevel, housing
  } = patientData;

  //COALESCE sert à choisir la première valeur non NULL parmi celles qu’on lui donne.
  const query = `
    UPDATE patients
    SET 
      name = COALESCE($1, name),
      surname = COALESCE($2, surname),
      birthdate = COALESCE($3, birthdate),
      gender = COALESCE($4, gender),
      city = COALESCE($5, city),
      state = COALESCE($6, state),
      postalcode = COALESCE($7, postalcode),
      nationality = COALESCE($8, nationality),
      height = COALESCE($9, height),
      modeoftransmission = COALESCE($10, modeoftransmission),
      maritalstatus = COALESCE($11, maritalstatus),
      numberchildren = COALESCE($12, numberchildren),
      educationlevel = COALESCE($13, educationlevel),
      housing = COALESCE($14, housing),
      updated_by = $15
    WHERE id = $16
    RETURNING *;
  `;

  const values = [
    name, surname, birthdate, gender, city, state, postalcode,
    nationality, height, modeoftransmission, maritalstatus,
    numberchildren, educationlevel, housing, updatedBy, id
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};
// chercher :
export const searchPatient = async (name, surname) => {
  const query = `
    SELECT * FROM patients
    WHERE name ILIKE $1 OR surname ILIKE $2
    ORDER BY surname, name
    LIMIT 50;
  `;
  const values = [`%${name}%`, `%${surname}%`];
  const result = await pool.query(query, values);
  return result.rows;
};



//Vérifie si un patient existe deja
export const checkPatientExists = async (name, surname, birthdate) => {
  const query = `
    SELECT COUNT(*) FROM patients
    WHERE LOWER(name) = LOWER($1) 
      AND LOWER(surname) = LOWER($2)
      AND birthdate = $3;
  `;
  const values = [name, surname, birthdate];

  const result = await pool.query(query, values);
  return parseInt(result.rows[0].count) > 0;
};
