import pool from "../config/db.js";
import { createAddress, updateAddress } from "./addresseModel.js";

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

export const getPatientByNumero = async (numero) => {
  const query = `
    SELECT
      p.*,

      -- Adresse IDs pour mise à jour
      p.birth_address_id,
      p.residence_address_id,

      -- Gouvernorat et code postal naissance
      bg.name AS birth_governorate,
      bp.id AS birth_postal_code_id,    -- ID du code postal
      bp.code AS birth_postal_code,     -- Code postal affichable
      bp.place_name AS birth_place_name,--  (optional) name to display instead of code

      -- Gouvernorat et code postal résidence
      rg.name AS residence_governorate,
      rp.id AS residence_postal_code_id,
      rp.code AS residence_postal_code,
      rp.place_name AS residence_place_name, -- (optional)

      --  Exact address (résidence only, as you requested)
      r.exact_address AS exact_address,

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
  return parseInt(result.rows[0].count, 10) > 0;
};

// --------------------- COUNT ---------------------
export const countPatients = async () => {
  const query = `SELECT COUNT(*) as count FROM patients`;
  const result = await pool.query(query);
  return parseInt(result.rows[0].count);
};

// ✅ Goal (as you chose): ONE form input "exact_address" stored ONLY in addresses.exact_address
// (residence address row), NOT in patients table.

export const createPatient = async (client, patientData, userId) => {
  const {
    numero,
    name,
    surname,
    birthdate,
    gender,
    birth_postal_code_id,
    residence_postal_code_id,
    exact_address, //  from form (residence exact address)
    phone,
    hospitalisation,
    status,
    remarks,
    email,
    whatsapp,
    doctor_id,
  } = patientData;

  // 1) Create addresses
  // Birth: no exact_address stored
  const birth_address_id = await createAddress(
    client,
    birth_postal_code_id,
    null,
  );

  // Residence: store exact_address in addresses.exact_address
  const residence_address_id = await createAddress(
    client,
    residence_postal_code_id,
    exact_address || null,
  );

  // 2) Create patient
  //  Remove "exact_address" from patients insert (it belongs to addresses table now)
  const patientResult = await client.query(
    `
      INSERT INTO patients (
        numero, name, surname, birthdate, gender,
        birth_address_id, residence_address_id,
        phone, hospitalisation, status, remarks,  email,
    whatsapp, doctor_id,
        created_by, updated_by
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
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
      status || "actif",
      remarks || null,
      email || null,
      whatsapp || null,
      doctor_id || null,
      userId,
      userId,
    ],
  );

  return patientResult.rows[0];
};

// --------------------- UPDATE ---------------------

export const updatePatient = async (id, patientData, updatedBy) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      numero,
      name,
      surname,
      birthdate,
      gender,
      birth_address_id,
      residence_address_id,
      birth_postal_code_id,
      residence_postal_code_id,
      exact_address, //  update residence exact_address in addresses table
      phone,
      hospitalisation,
      status,
      remarks,
      email,
      whatsapp, 
      doctor_id,
    } = patientData;

    // 1) Update addresses
    if (birth_address_id && birth_postal_code_id) {
      // Birth: only update postal_code_id (no exact address)
      await updateAddress(client, birth_address_id, birth_postal_code_id, null);
    }

    if (residence_address_id && residence_postal_code_id) {
      // Residence: update postal_code_id + exact_address
      await updateAddress(
        client,
        residence_address_id,
        residence_postal_code_id,
        exact_address || null,
      );
    }

    // 2) Update patient ( no exact_address column here)
    const result = await client.query(
      `
      UPDATE patients
      SET 
        numero = COALESCE($1, numero),
        name = COALESCE($2, name),
        surname = COALESCE($3, surname),
        birthdate = COALESCE($4, birthdate),
        gender = COALESCE($5, gender),
        phone = COALESCE($6, phone),
        hospitalisation = COALESCE($7, hospitalisation),
        status = COALESCE($8, status),
        remarks = COALESCE($9, remarks),
        email = COALESCE($10, email),
        whatsapp = COALESCE($11, whatsapp),
        doctor_id = COALESCE($12, doctor_id),
        updated_by = $13,
        updated_at = NOW()
      WHERE id = $14
      RETURNING *;
      `,
      [
        numero,
        name,
        surname,
        birthdate,
        gender,
        phone,
        hospitalisation, //  fixed: correct placeholder index
        status || "actif",
        remarks || null,
        email || null,
        whatsapp || null,
        doctor_id || null,
        updatedBy,
        id,
      ],
    );

    if (result.rows.length === 0) throw new Error("Patient non trouvé.");

    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};


