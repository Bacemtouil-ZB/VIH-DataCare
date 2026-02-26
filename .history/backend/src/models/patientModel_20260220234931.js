import pool from "../config/db.js";
import { createAddress } from "./addresseModel.js";

// --------------------- CREATE ---------------------

export const createPatient = async (patientData, userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // Démarre une transaction

    const {
      numero,
      name,
      surname,
      birthdate,
      gender,
      birth_postal_code_id,
      residence_postal_code_id,
      phone,
      hospitalisation,
      last_visit_date,
      remarks,
      doctor_id,
    } = patientData;

    //Création des adresses
    const birth_address_id = await createAddress(
      client,
      birth_postal_code_id,
      null,
    );

    const residence_address_id = await createAddress(
      client,
      residence_postal_code_id,
    );

    // Création du patient

    const patientResult = await client.query(
      `
      INSERT INTO patients (
        numero, name, surname, birthdate, gender,
        birth_address_id, residence_address_id,
        phone, hospitalisation, last_visit_date,remarks, doctor_id,
        created_by, updated_by
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *;
      `,
      [
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
        remarks || null,
        doctor_id || null,
        userId,
        userId,
      ],
    );

    await client.query("COMMIT"); // Valide la transaction

    return patientResult.rows[0];
  } catch (err) {
    await client.query("ROLLBACK"); // Annule la transaction en cas d'erreur

    //Violation UNIQUE
    if (err.code === "23505")
      throw new Error("Ce numéro de patient existe déjà.");
    // //Violation CHECK
    if (err.code === "23514")
      throw new Error("Valeur invalide pour gender ou hospitalisation.");

    throw err;
  } finally {
    client.release(); // Libère le client de la pool
  }
};
// --------------------- UPDATE ---------------------
// export const updatePatient = async (id, patientData, updatedBy) => {
//   const {
//     numero,
//     name,
//     surname,
//     birthdate,
//     gender,
//     birth_address_id,
//     residence_address_id,
//     phone,
//     hospitalisation,
//     last_visit_date,
//     remarks,
//     doctor_id,
//   } = patientData;

//   const query = `
//     UPDATE patients
//     SET
//       numero = COALESCE($1, numero),
//       name = COALESCE($2, name),
//       surname = COALESCE($3, surname),
//       birthdate = COALESCE($4, birthdate),
//       gender = COALESCE($5, gender),
//       birth_address_id = COALESCE($6, birth_address_id),
//       residence_address_id = COALESCE($7, residence_address_id),
//       phone = COALESCE($8, phone),
//       hospitalisation = COALESCE($9, hospitalisation),
//       last_visit_date = COALESCE($10, last_visit_date),
//       remarks = COALESCE($11, remarks),
//       doctor_id = COALESCE($12, doctor_id),
//       updated_by = $13,
//       updated_at = NOW()
//     WHERE id = $13
//     RETURNING *;
//   `;

//   const values = [
//     numero,
//     name,
//     surname,
//     birthdate,
//     gender,
//     birth_address_id || null,
//     residence_address_id || null,
//     phone,
//     hospitalisation,
//     last_visit_date || null,
//     remarks || null,
//     doctor_id || null,
//     updatedBy,
//     id,
//   ];

//   const result = await pool.query(query, values);
//   return result.rows[0];
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
    phone,
    hospitalisation,
    last_visit_date,
    remarks,
    doctor_id,
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
      remarks = COALESCE($11, remarks),
      doctor_id = COALESCE($12, doctor_id),
      updated_by = $13,
      updated_at = NOW()
    WHERE id = $14
    RETURNING *;
  `;

  const values = [
    numero,
    name,
    surname,
    birthdate,
    gender,
    birth_address_id ?? null,
    residence_address_id ?? null,
    phone,
    hospitalisation,
    last_visit_date ?? null,
    remarks ?? null,
    doctor_id ?? null,
    updatedBy,
    id,
  ];

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new Error("Patient non trouvé.");
  }

  return result.rows[0];
};

// --------------------- GET BY ID ---------------------
export const getPatientById = async (id) => {
  const query = `
    SELECT
      p.*,
      bg.name AS birth_governorate,
      bp.code AS birth_code_postal,
      rg.name AS res_governorate,
      rp.code AS res_code_postal,
      u1.nom AS created_by_nom,
      u1.prenom AS created_by_prenom,
      u2.nom AS updated_by_nom,
      u2.prenom AS updated_by_prenom
    FROM patients p
    LEFT JOIN addresses b ON p.birth_address_id = b.id
    LEFT JOIN postal_codes bp ON b.postal_code_id = bp.id
    LEFT JOIN governorates bg ON bp.governorate_id = bg.id
    LEFT JOIN addresses r ON p.residence_address_id = r.id
    LEFT JOIN postal_codes rp ON r.postal_code_id = rp.id
    LEFT JOIN governorates rg ON rp.governorate_id = rg.id
    LEFT JOIN users u1 ON p.created_by = u1.id
    LEFT JOIN users u2 ON p.updated_by = u2.id
    WHERE p.id = $1;
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

// --------------------- GET BY NUMERO ---------------------
// export const getPatientByNumero = async (numero) => {
//   const query = `
//     SELECT
//       p.*,
//       bg.name AS birth_governorate,
//       bp.code AS birth_code_postal,
//       rg.name AS res_governorate,
//       rp.code AS res_code_postal,
//       u1.nom AS created_by_nom,
//       u1.prenom AS created_by_prenom,
//       u2.nom AS updated_by_nom,
//       u2.prenom AS updated_by_prenom,
//       d.nom AS doctor_nom,
//       d.prenom AS doctor_prenom
//     FROM patients p
//     LEFT JOIN addresses b ON p.birth_address_id = b.id
//     LEFT JOIN postal_codes bp ON b.postal_code_id = bp.id
//     LEFT JOIN governorates bg ON bp.governorate_id = bg.id
//     LEFT JOIN addresses r ON p.residence_address_id = r.id
//     LEFT JOIN postal_codes rp ON r.postal_code_id = rp.id
//     LEFT JOIN governorates rg ON rp.governorate_id = rg.id
//     LEFT JOIN users u1 ON p.created_by = u1.id
//     LEFT JOIN users u2 ON p.updated_by = u2.id
//     LEFT JOIN users d ON d.role = 'medecin'
//     WHERE p.numero = $1;
//   `;

//   const result = await pool.query(query, [numero]);
//   return result.rows[0] || null;
// };
export const getPatientByNumero = async (numero) => {
  const query = `
    SELECT
      p.*,
      
      -- Adresse de naissance
      b.exact_address AS birth_exact_address,
      bp.code AS birth_code_postal,
      bg.name AS birth_governorate,
      
      -- Adresse de résidence
      r.exact_address AS residence_exact_address,
      rp.code AS residence_code_postal,
      rg.name AS residence_governorate,
      
      -- Créé et modifié par
      u1.nom AS created_by_nom,
      u1.prenom AS created_by_prenom,
      u2.nom AS updated_by_nom,
      u2.prenom AS updated_by_prenom,
      
      -- Médecin
      d.nom AS doctor_nom,
      d.prenom AS doctor_prenom

    FROM patients p

    -- Adresse de naissance
    LEFT JOIN addresses b ON p.birth_address_id = b.id
    LEFT JOIN postal_codes bp ON b.postal_code_id = bp.id
    LEFT JOIN governorates bg ON bp.governorate_id = bg.id

    -- Adresse de résidence
    LEFT JOIN addresses r ON p.residence_address_id = r.id
    LEFT JOIN postal_codes rp ON r.postal_code_id = rp.id
    LEFT JOIN governorates rg ON rp.governorate_id = rg.id

    -- Créé et modifié par
    LEFT JOIN users u1 ON p.created_by = u1.id
    LEFT JOIN users u2 ON p.updated_by = u2.id

    -- Médecin assigné au patient
    LEFT JOIN users d ON p.doctor_id = d.id

    WHERE p.numero = $1;
  `;

  const result = await pool.query(query, [numero]);
  return result.rows[0] || null;
};
// --------------------- GET ALL ---------------------
export const getAllPatients = async (options = {}) => {
  const query = `
    SELECT
      p.*,
      bg.name AS birth_governorate,
      bp.code AS birth_code_postal,
      rg.name AS res_governorate,
      rp.code AS res_code_postal
    FROM patients p
    LEFT JOIN addresses b ON p.birth_address_id = b.id
    LEFT JOIN postal_codes bp ON b.postal_code_id = bp.id
    LEFT JOIN governorates bg ON bp.governorate_id = bg.id
    LEFT JOIN addresses r ON p.residence_address_id = r.id
    LEFT JOIN postal_codes rp ON r.postal_code_id = rp.id
    LEFT JOIN governorates rg ON rp.governorate_id = rg.id
    ORDER BY p.created_at ${options.sortOrder || "DESC"};
  `;

  const result = await pool.query(query);
  return result.rows;
};

// --------------------- CHECK NUMERO EXISTS ---------------------
export const checkNumeroExists = async (numero) => {
  const query = `SELECT COUNT(*) as count FROM patients WHERE numero = $1`;
  const result = await pool.query(query, [numero]);
  return parseInt(result.rows[0].count) > 0;
};

// --------------------- COUNT ---------------------
export const countPatients = async () => {
  const query = `SELECT COUNT(*) as count FROM patients`;
  const result = await pool.query(query);
  return parseInt(result.rows[0].count);
};
