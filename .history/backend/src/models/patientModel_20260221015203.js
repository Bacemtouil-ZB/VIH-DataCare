import pool from "../config/db.js";
import { createAddress, updateAddress } from "./addresseModel.js";

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
export const updatePatient = async (id, patientData, updatedBy) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // démarrer transaction

    const {
      numero,
      name,
      surname,
      birthdate,
      gender,
      birth_address_id,
      birth_postal_code_id,
      residence_address_id,
      residence_postal_code_id,
      phone,
      hospitalisation,
      last_visit_date,
      remarks,
      doctor_id,
    } = patientData;

    // 1️⃣ Mettre à jour les adresses si le code postal change
    if (birth_postal_code_id) {
      await updateAddress(client, birth_address_id, birth_postal_code_id);
    }

    if (residence_postal_code_id) {
      await updateAddress(
        client,
        residence_address_id,
        residence_postal_code_id,
      );
    }

    // 2️⃣ Mettre à jour le patient
    const query = `
      UPDATE patients
      SET 
        numero = $1,
        name = $2,
        surname = $3,
        birthdate = $4,
        gender = $5,
        phone = $6,
        hospitalisation = $7,
        last_visit_date = $8,
        remarks = $9,
        doctor_id = $10,
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
      phone,
      hospitalisation,
      last_visit_date || null,
      remarks || null,
      doctor_id || null,
      updatedBy,
      id,
    ];

    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("Patient non trouvé.");
    }

    await client.query("COMMIT"); // valider transaction
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
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

export const getPatientByNumero = async (numero) => {
  const query = `
    SELECT
      p.*,

      -- Gouvernorat et code postal naissance
      bg.name AS birth_governorate,
      bp.id AS birth_postal_code_id,   -- ID pour mise à jour
      bp.code AS birth_postal_code,    -- code postal affichable

      -- Gouvernorat et code postal résidence
      rg.name AS residence_governorate,
      rp.id AS residence_postal_code_id, 
      rp.code AS residence_postal_code, 

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
