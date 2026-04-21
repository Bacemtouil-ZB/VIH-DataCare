//cheked 15/04/2026
import pool from "../config/db.js";
import { createAddress, updateAddress } from "./addresseModel.js";
import { stripNumeroPrefix } from "../utils/numero.js"; 

// --------------------- GET PATIENT BY ID ---------------------
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
// --------------------- GET PATIENT BY NUMERO ---------------------
export const getPatientByNumero = async (numero) => {
  const query = `
    SELECT
      p.*,

      p.birth_address_id,
      p.residence_address_id,

      -- Gouvernorat et code postal naissance
      bg.name AS birth_governorate,
      bp.id AS birth_postal_code_id,    
      bp.code AS birth_postal_code,    
      bp.place_name AS birth_place_name,

      -- Gouvernorat et code postal résidence
      rg.name AS residence_governorate,
      rp.id AS residence_postal_code_id,
      rp.code AS residence_postal_code,
      rp.place_name AS residence_place_name, -- (optional)

      --  Exact address 
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
  const query = `
    SELECT COUNT(*) as count 
    FROM patients 
    WHERE REPLACE(numero, 'F-', '') = REPLACE($1, 'F-', '')
  `;
  const result = await pool.query(query, [numero]);
  return parseInt(result.rows[0].count, 10) > 0;
};

// --------------------- COUNT ---------------------
export const countPatients = async () => {
  const query = `SELECT COUNT(*) as count FROM patients`;
  const result = await pool.query(query);
  return parseInt(result.rows[0].count);
};

// --------------------- CREATE ---------------------
export const createPatient = async (client, patientData, userId) => {
  const {
    numero,
    name,
    surname,
    birthdate,
    gender,
    birth_postal_code_id,
    residence_postal_code_id,
    exact_address, 
    phone,
    hospitalisation,
    status,        // médecin peut envoyer uniquement les 4 administratifs
    remarks,
    email,
    whatsapp,
    doctor_id,
  } = patientData;

  // 1) Create addresses
  const birth_address_id = await createAddress(
    client,
    birth_postal_code_id,
    null,
  );

  const residence_address_id = await createAddress(
    client,
    residence_postal_code_id,
    exact_address || null,
  );

  // 2) Create patient
  
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
      status === 'migrant' ? 'migrant' : 'standard', // par défaut 'standard' si pas 'migrant'
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
      exact_address,
      phone,
      hospitalisation,
      status,        // médecin peut envoyer uniquement les 4 administratifs
      remarks,
      email,
      whatsapp,
      doctor_id,
    } = patientData;

    // ── Validation statut : uniquement les 4 administratifs ──
    const STATUTS_ADMIN = ['decede', 'decede_sida', 'transfere', 'migrant'];
    const statutValide = status && STATUTS_ADMIN.includes(status) ? status : undefined;

    // 1) Update addresses
    if (birth_address_id && birth_postal_code_id) {
      await updateAddress(client, birth_address_id, birth_postal_code_id, null);
    }

    if (residence_address_id && residence_postal_code_id) {
      await updateAddress(
        client,
        residence_address_id,
        residence_postal_code_id,
        exact_address || null,
      );
    }

    // 2) Update patient
    const result = await client.query(
      `
      UPDATE patients
      SET 
        numero         = COALESCE($1,  numero),
        name           = COALESCE($2,  name),
        surname        = COALESCE($3,  surname),
        birthdate      = COALESCE($4,  birthdate),
        gender         = COALESCE($5,  gender),
        phone          = COALESCE($6,  phone),
        hospitalisation = COALESCE($7, hospitalisation),
        status         = COALESCE($8,  status),
        remarks        = COALESCE($9,  remarks),
        email          = COALESCE($10, email),
        whatsapp       = COALESCE($11, whatsapp),
        doctor_id      = COALESCE($12, doctor_id),
        updated_by     = $13,
        updated_at     = NOW()
      WHERE id = $14
      RETURNING *;
      `,
      [
        numero        || null,
        name          || null,
        surname       || null,
        birthdate     || null,
        gender        || null,
        phone         || null,
        hospitalisation || null,
        statutValide  || null,   // undefined/non-admin → null → COALESCE garde l'ancien
        remarks       || null,
        email         || null,
        whatsapp      || null,
        doctor_id     || null,
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

// fonction pour patient en_attente sans aucune ligne suivi depuis plus de 180 jours → on les passe en perdu_de_vue
export const recalculerTousLesStatuts = async () => {
  const { rows } = await pool.query(
    `SELECT p.id, p.status
     FROM patients p
     LEFT JOIN suivi_therapeutique st ON st.patient_id = p.id
     WHERE p.status IN ('standard', 'migrant')
     AND st.id IS NULL
     AND NOT EXISTS (
       SELECT 1 FROM prescription_medicale pm
       WHERE pm.patient_id = p.id
       AND pm.statut = 'envoyee'
       AND pm.created_at >= NOW() - INTERVAL '48 hours'  -- ✅ exclure seulement récentes
     );`
  );

  if (rows.length === 0) return [];

  const standardIds = rows.filter(r => r.status === 'standard').map(r => r.id);
  const migrantIds  = rows.filter(r => r.status === 'migrant').map(r => r.id);

  const updated = [];

  if (standardIds.length > 0) {
    const { rows: s } = await pool.query(
      `UPDATE patients
       SET status = 'standard_inactif', updated_at = NOW()
       WHERE id = ANY($1::int[])
       AND CURRENT_DATE - created_at::date >= 180
       RETURNING id, status;`,
      [standardIds]
    );
    updated.push(...s);
  }

  if (migrantIds.length > 0) {
    const { rows: m } = await pool.query(
      `UPDATE patients
       SET status = 'migrant_inactif', updated_at = NOW()
       WHERE id = ANY($1::int[])
       AND CURRENT_DATE - created_at::date >= 180
       RETURNING id, status;`,
      [migrantIds]
    );
    updated.push(...m);
  }

  return updated;
};


// --------------------- GET LEFT PANEL DATA ---------------------
export const getLeftPanelData = async (numero) => {
  const raw = stripNumeroPrefix(numero);
  const withPrefix = `F-${raw}`;

  const { rows } = await pool.query(`
    SELECT
      -- Info patient
      p.id              AS patient_id,
      p.numero,
      p.name,
      p.surname,
      p.birthdate,
      p.hospitalisation,

      -- Statut suivi_therapeutique dernière ligne
      (
        SELECT st.statut_patient
        FROM suivi_therapeutique st
        WHERE st.patient_id = p.id
        ORDER BY st.created_at DESC
        LIMIT 1
      ) AS statut_suivi,

      -- Dernier traitement
      (
        SELECT STRING_AGG(pl.medicament_nom_snapshot, ', ' ORDER BY pl.id)
        FROM prescription_lignes pl
        INNER JOIN prescription_medicale pm ON pm.id = pl.prescription_id
        WHERE pm.patient_id = p.id
          AND pm.statut IN ('delivree', 'modifie')
          AND pm.date_delivrance = (
            SELECT MAX(pm2.date_delivrance)
            FROM prescription_medicale pm2
            WHERE pm2.patient_id = p.id
              AND pm2.statut IN ('delivree', 'modifie')
          )
      ) AS dernier_traitement,

      -- Dernière charge virale
      (
        SELECT rb.charge_virale_valeur
        FROM resultats_biologiques rb
        WHERE rb.patient_id = p.id
          AND rb.charge_virale_valeur IS NOT NULL
        ORDER BY rb.date_charge_virale_vih DESC NULLS LAST, rb.created_at DESC
        LIMIT 1
      ) AS derniere_charge_virale,

      (
        SELECT rb.date_charge_virale_vih
        FROM resultats_biologiques rb
        WHERE rb.patient_id = p.id
          AND rb.charge_virale_valeur IS NOT NULL
        ORDER BY rb.date_charge_virale_vih DESC NULLS LAST, rb.created_at DESC
        LIMIT 1
      ) AS date_charge_virale,

      -- Dernier CD4
      (
        SELECT rb.cd4_absolu
        FROM resultats_biologiques rb
        WHERE rb.patient_id = p.id
          AND rb.cd4_absolu IS NOT NULL
        ORDER BY rb.date_cd4_cd8 DESC NULLS LAST, rb.created_at DESC
        LIMIT 1
      ) AS dernier_cd4_absolu,

      (
        SELECT rb.cd4_pourcent
        FROM resultats_biologiques rb
        WHERE rb.patient_id = p.id
          AND rb.cd4_absolu IS NOT NULL
        ORDER BY rb.date_cd4_cd8 DESC NULLS LAST, rb.created_at DESC
        LIMIT 1
      ) AS dernier_cd4_pourcent,

      (
        SELECT rb.date_cd4_cd8
        FROM resultats_biologiques rb
        WHERE rb.patient_id = p.id
          AND rb.cd4_absolu IS NOT NULL
        ORDER BY rb.date_cd4_cd8 DESC NULLS LAST, rb.created_at DESC
        LIMIT 1
      ) AS date_cd4

    FROM patients p
    WHERE p.numero = $1 OR p.numero = $2;
  `, [withPrefix, raw]);

  return rows[0] ?? null;
};