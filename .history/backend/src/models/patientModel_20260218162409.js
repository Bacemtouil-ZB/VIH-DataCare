import pool from "../config/db.js";

// export const createPatient = async (patientData, createdBy) => {
//   const {
//     numero,
//     name,
//     surname,
//     birthdate,
//     gender,
//     city_of_birth,
//     city_of_residence,
//     phone,
//     address,
//     hospitalisation,
//   } = patientData;

//   const query = `
//     INSERT INTO patients (
//       numero, name, surname, birthdate, gender,
//       city_of_birth, city_of_residence, phone, address,
//       hospitalisation, created_by
//     )
//     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
//     RETURNING *;
//   `;

//   const values = [
//     numero,
//     name,
//     surname,
//     birthdate,
//     gender,
//     city_of_birth,
//     city_of_residence,
//     phone,
//     address || null,
//     hospitalisation,
//     createdBy,
//   ];

//   const result = await pool.query(query, values);
//   return result.rows[0];
// };

// export const getPatientById = async (id) => {
//   const query = `
//     SELECT
//       p.*,
//       u1.nom as created_by_nom,
//       u1.prenom as created_by_prenom,
//       u2.nom as updated_by_nom,
//       u2.prenom as updated_by_prenom
//     FROM patients p
//     LEFT JOIN users u1 ON p.created_by = u1.id
//     LEFT JOIN users u2 ON p.updated_by = u2.id
//     WHERE p.id = $1;
//   `;

//   const result = await pool.query(query, [id]);
//   return result.rows[0] || null;
// };
export const createPatient = async (patientData, createdBy) => {
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

// export const getPatientByNumero = async (numero) => {
//   const query = `
//     SELECT
//       p.*,
//       u1.nom as created_by_nom,
//       u1.prenom as created_by_prenom,
//       u2.nom as updated_by_nom,
//       u2.prenom as updated_by_prenom
//     FROM patients p
//     LEFT JOIN users u1 ON p.created_by = u1.id
//     LEFT JOIN users u2 ON p.updated_by = u2.id
//     WHERE p.numero = $1;
//   `;

//   const result = await pool.query(query, [numero]);
//   return result.rows[0] || null;
// };
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

// export const checkNumeroExists = async (numero) => {
//   const query = `
//     SELECT COUNT(*) as count FROM patients
//     WHERE numero = $1
//   `;
//   const result = await pool.query(query, [numero]);
//   return parseInt(result.rows[0].count) > 0;
// };
export const checkNumeroExists = async (numero) => {
  const query = `
    SELECT COUNT(*) as count FROM patients
    WHERE numero_dossier = $1
  `;
  const result = await pool.query(query, [numero]);
  return parseInt(result.rows[0].count) > 0;
};

// export const getAllPatients = async (options = {}) => {
//   let query = `
//     SELECT * FROM patients
//     WHERE 1=1
//   `;
//   const values = [];
//   let paramCount = 1;

//   // Filtre par nom
//   if (options.name) {
//     query += ` AND LOWER(name) LIKE LOWER($${paramCount})`;
//     values.push(`%${options.name}%`);
//     paramCount++;
//   }

//   // Filtre par prénom
//   if (options.surname) {
//     query += ` AND LOWER(surname) LIKE LOWER($${paramCount})`;
//     values.push(`%${options.surname}%`);
//     paramCount++;
//   }

//   // Filtre par numéro de dossier
//   if (options.numero) {
//     query += ` AND numero = $${paramCount}`;
//     values.push(options.numero);
//     paramCount++;
//   }

//   // Filtre par ville
//   if (options.city) {
//     query += ` AND LOWER(city_of_residence) LIKE LOWER($${paramCount})`;
//     values.push(`%${options.city}%`);
//     paramCount++;
//   }

//   // Filtre par genre
//   if (options.gender) {
//     query += ` AND gender = $${paramCount}`;
//     values.push(options.gender);
//     paramCount++;
//   }

//   // Filtre par hospitalisation
//   if (options.hospitalisation) {
//     query += ` AND hospitalisation = $${paramCount}`;
//     values.push(options.hospitalisation);
//     paramCount++;
//   }

//   query += ` ORDER BY created_at ${options.sortOrder || "DESC"}`;

//   const result = await pool.query(query, values);
//   return result.rows;
// };
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

  // Filtre par nom
  if (options.name) {
    query += ` AND LOWER(p.name) LIKE LOWER($${paramCount})`;
    values.push(`%${options.name}%`);
    paramCount++;
  }

  // Filtre par prénom
  if (options.surname) {
    query += ` AND LOWER(p.surname) LIKE LOWER($${paramCount})`;
    values.push(`%${options.surname}%`);
    paramCount++;
  }

  // Filtre par numéro de dossier
  if (options.numero) {
    query += ` AND p.numero_dossier = $${paramCount}`;
    values.push(options.numero);
    paramCount++;
  }

  // Filtre par ville (gouvernorat de résidence)
  if (options.city) {
    query += ` AND LOWER(r.governorate) LIKE LOWER($${paramCount})`;
    values.push(`%${options.city}%`);
    paramCount++;
  }

  // Filtre par genre
  if (options.gender) {
    query += ` AND p.gender = $${paramCount}`;
    values.push(options.gender);
    paramCount++;
  }

  // Filtre par hospitalisation
  if (options.hospitalisation) {
    query += ` AND p.hospitalisation = $${paramCount}`;
    values.push(options.hospitalisation);
    paramCount++;
  }

  query += ` ORDER BY p.created_at ${options.sortOrder || "DESC"}`;

  const result = await pool.query(query, values);
  return result.rows;
};

// export const updatePatient = async (id, patientData, updatedBy) => {
//   const {
//     numero,
//     name,
//     surname,
//     birthdate,
//     gender,
//     city_of_birth,
//     city_of_residence,
//     phone,
//     address,
//     hospitalisation,
//     last_visit_date,
//   } = patientData;

//   const query = `
//     UPDATE patients
//     SET
//       numero = COALESCE($1, numero),
//       name = COALESCE($2, name),
//       surname = COALESCE($3, surname),
//       birthdate = COALESCE($4, birthdate),
//       gender = COALESCE($5, gender),
//       city_of_birth = COALESCE($6, city_of_birth),
//       city_of_residence = COALESCE($7, city_of_residence),
//       phone = COALESCE($8, phone),
//       address = COALESCE($9, address),
//       hospitalisation = COALESCE($10, hospitalisation),
//       last_visit_date = COALESCE($11, last_visit_date),
//       updated_by = $12
//     WHERE id = $13
//     RETURNING *;
//   `;

//   const values = [
//     numero,
//     name,
//     surname,
//     birthdate,
//     gender,
//     city_of_birth,
//     city_of_residence,
//     phone,
//     address,
//     hospitalisation,
//     last_visit_date,
//     updatedBy,
//     id,
//   ];

//   const result = await pool.query(query, values);
//   return result.rows[0];
// };

// export const searchPatients = async (searchParams) => {
//   const { birthdate, numero, lastVisitFrom, lastVisitTo, name, surname } =
//     searchParams;

//   let query = `
//     SELECT
//       p.*,
//       u1.nom as created_by_nom,
//       u1.prenom as created_by_prenom
//     FROM patients p
//     LEFT JOIN users u1 ON p.created_by = u1.id
//   `;

//   const values = [];
//   const conditions = [];
//   let paramCount = 1;

//   // Recherche par numéro de dossier (exacte)
//   if (numero) {
//     conditions.push(`p.numero = $${paramCount}`);
//     values.push(numero);
//     paramCount++;
//   }
//   if (birthdate) {
//     conditions.push(`p.birthdate = $${paramCount}`);
//     values.push(birthdate);
//     paramCount++;
//   }
//   if (name) {
//     conditions.push(`LOWER(p.name) LIKE LOWER($${paramCount})`);
//     values.push(`%${name}%`);
//     paramCount++;
//   }
//   if (surname) {
//     conditions.push(`LOWER(p.surname) LIKE LOWER($${paramCount})`);
//     values.push(`%${surname}%`);
//     paramCount++;
//   }

//   // Recherche par plage de dernière visite
//   if (lastVisitFrom) {
//     conditions.push(`p.last_visit_date >= $${paramCount}`);
//     values.push(lastVisitFrom);
//     paramCount++;
//   }

//   if (lastVisitTo) {
//     conditions.push(`p.last_visit_date <= $${paramCount}`);
//     values.push(lastVisitTo);
//     paramCount++;
//   }

//   if (conditions.length > 0) {
//     query += ` WHERE ${conditions.join(" AND ")}`;
//   }

//   query += ` ORDER BY p.created_at DESC`;

//   const result = await pool.query(query, values);
//   return result.rows;
// };
export const updatePatient = async (id, patientData, updatedBy) => {
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

// export const updateLastVisitDate = async (id) => {
//   const query = `
//     UPDATE patients
//     SET last_visit_date = NOW()
//     WHERE id = $1
//     RETURNING *;
//   `;

//   const result = await pool.query(query, [id]);
//   return result.rows[0];
// };
