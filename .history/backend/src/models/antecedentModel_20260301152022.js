// ---------- Patient ----------
export async function getPatientByNumero(client, numero) {
  const r = await client.query(`SELECT * FROM patients WHERE numero = $1;`, [
    numero,
  ]);
  return r.rows[0] || null;
}

// ---------- Antecedent header ----------
export async function getActiveAntecedentByPatientId(client, patientId) {
  const r = await client.query(
    `
    SELECT *
    FROM antecedents
    WHERE patient_id = $1 AND status = 'active'
    ORDER BY created_at DESC --ORDER BY est une sécurité.
    LIMIT 1;
    `,
    [patientId],
  );
  return r.rows[0] || null;
}

export async function createAntecedent(
  client,
  { patientId, versionNumber, userId },
) {
  const r = await client.query(
    `
    INSERT INTO antecedents (patient_id, version_number, status, created_by, updated_by)
    VALUES ($1, $2, 'active', $3, $3)
    RETURNING *;
    `,
    [patientId, versionNumber, userId],
  );
  return r.rows[0];
}

export async function archiveAntecedent(client, antecedentId, archivedBy) {
  await client.query(
    `
    UPDATE antecedents
    SET status='archived',
        archived_by=$2,
        archived_at=NOW(),
        updated_by=$2,
        updated_at=NOW()
    WHERE id=$1;
    `,
    [antecedentId, archivedBy],
  );
}

//touchAntecedent : Quand une sous-table change enregistrer la date de mise à jour de l'antécédent .
//-----------
export async function touchAntecedent(client, antecedentId, userId) {
  await client.query(
    `UPDATE antecedents SET updated_by=$2, updated_at=NOW() WHERE id=$1;`,
    [antecedentId, userId],
  );
}

// ---------- 1-1 generic upsert + get pour éviter de dupliquer le code pour chaque table d'antécédent ----------
// async function upsertOneToOne(client, table, antecedentId, payload, userId) {
//   // payload = data incoming from client that we want to insert/update in the table. We need to filter out any system fields that should not be inserted/updated directly by the client (like id, created_at, etc.) to prevent accidental overwrites or security issues.
//   const SYSTEM_KEYS = new Set([
//     //  System fields that should never be inserted
//     "id",
//     "antecedent_id",
//     "created_by",
//     "updated_by",
//     "created_at",
//     "updated_at",
//     "archived_by",
//     "archived_at",
//     // in case client sends camelCase
//     "antecedentId",
//     "createdBy",
//     "updatedBy",
//     "createdAt",
//     "updatedAt",
//     "archivedBy",
//     "archivedAt",
//   ]);
//   // Remove system fields from payload
//   const cleanPayload = payload && typeof payload === "object" ? payload : {};
//   const keys = Object.keys(cleanPayload).filter((k) => !SYSTEM_KEYS.has(k));

//   if (keys.length === 0) return null;

//   const cols = keys.map((k) => `"${k}"`).join(", ");
//   const placeholders = keys.map((_, i) => `$${i + 2}`).join(", ");
//   const updateSet = keys.map((k) => `"${k}" = EXCLUDED."${k}"`).join(", ");
//   const values = [antecedentId, ...keys.map((k) => cleanPayload[k])];

//   const q = `
//     INSERT INTO ${table} (antecedent_id, ${cols}, updated_by, updated_at)
//     VALUES ($1, ${placeholders}, $${values.length + 1}, NOW())
//     ON CONFLICT (antecedent_id)
//     DO UPDATE SET
//       ${updateSet},
//       updated_by = EXCLUDED.updated_by,
//       updated_at = NOW()
//     RETURNING *;
//   `;

//   const r = await client.query(q, [...values, userId]);
//   return r.rows[0] || null;
// }
async function upsertOneToOne(client, table, antecedentId, payload, userId) {
  // List of system fields that should NEVER be inserted or updated by the client
  // These fields are controlled by the backend/database
  const SYSTEM_KEYS = new Set([
    "id",
    "antecedent_id",
    "created_by",
    "updated_by",
    "created_at",
    "updated_at",
    "archived_by",
    "archived_at",

    // Same fields but in camelCase in case frontend sends them like that
    "antecedentId",
    "createdBy",
    "updatedBy",
    "createdAt",
    "updatedAt",
    "archivedBy",
    "archivedAt",
  ]);

  // Ensure payload is a valid object
  // If payload is null or not an object we replace it with an empty object
  const cleanPayload = payload && typeof payload === "object" ? payload : {};

  // Extract the keys (field names) from payload
  // Then remove any system fields
  const keys = Object.keys(cleanPayload).filter((k) => !SYSTEM_KEYS.has(k));

  // If no valid fields remain, stop the function
  // Nothing to insert or update
  if (keys.length === 0) return null;

  // Arrays that will help build the SQL query dynamically
  const cols = []; // column names for INSERT
  const placeholders = []; // $1 $2 $3 placeholders for SQL
  const updateSet = []; // update rules for ON CONFLICT
  const values = [antecedentId]; // values sent to PostgreSQL (first is antecedent_id)

  // Start placeholder index at 2 because $1 is already used by antecedent_id
  let index = 2;

  // Loop through each field sent by the client
  for (const key of keys) {
    // Add column name to INSERT
    cols.push(`"${key}"`);

    // Add SQL placeholder ($2, $3, $4...)
    placeholders.push(`$${index}`);

    // Add update rule used when conflict occurs
    // EXCLUDED refers to the new values we attempted to insert
    updateSet.push(`"${key}" = EXCLUDED."${key}"`);

    // Add the actual value corresponding to the column
    values.push(cleanPayload[key]);

    index++;
  }

  // Convert arrays into comma separated strings for SQL
  const colsStr = cols.join(", ");
  const placeholdersStr = placeholders.join(", ");
  const updateSetStr = updateSet.join(", ");

  // Build the SQL query
  const query = `
    INSERT INTO ${table} (antecedent_id, ${colsStr}, updated_by, updated_at)
    VALUES ($1, ${placeholdersStr}, $${values.length + 1}, NOW())

    -- If a record with the same antecedent_id already exists
    ON CONFLICT (antecedent_id)
    DO UPDATE SET
      ${updateSetStr},
      updated_by = EXCLUDED.updated_by,
      updated_at = NOW()

    -- Return the inserted or updated row
    RETURNING *;
  `;

  // Execute query and send values to PostgreSQL
  const result = await client.query(query, [...values, userId]);

  // Return the inserted/updated row (or null if none)
  return result.rows[0] || null;
}
async function getOneToOne(client, table, antecedentId) {
  const r = await client.query(
    `SELECT * FROM ${table} WHERE antecedent_id = $1;`,
    [antecedentId],
  );
  return r.rows[0] || null;
}
//(c, id, p, u) == (client, antecedentId, payload, userId)
// 1-1 medical
export const getMedical = (c, id) => getOneToOne(c, "antecedent_medical", id);
export const upsertMedical = (c, id, p, u) =>
  upsertOneToOne(c, "antecedent_medical", id, p, u);

// 1-1 infectious
export const getInfectious = (c, id) =>
  getOneToOne(c, "antecedent_infectious", id);
export const upsertInfectious = (c, id, p, u) =>
  upsertOneToOne(c, "antecedent_infectious", id, p, u);

// 1-1 therapeutic
export const getTherapeutic = (c, id) =>
  getOneToOne(c, "antecedent_therapeutic", id);
export const upsertTherapeutic = (c, id, p, u) =>
  upsertOneToOne(c, "antecedent_therapeutic", id, p, u);

// 1-1 family
export const getFamily = (c, id) => getOneToOne(c, "antecedent_family", id);
export const upsertFamily = (c, id, p, u) =>
  upsertOneToOne(c, "antecedent_family", id, p, u);

// 1-1 gyneco
export const getGyneco = (c, id) => getOneToOne(c, "antecedent_gyneco", id);
export const upsertGyneco = (c, id, p, u) =>
  upsertOneToOne(c, "antecedent_gyneco", id, p, u);

// ---------------- 1-N replace mode: surgical / transfusion / aes ----------
export async function getSurgical(client, antecedentId) {
  const r = await client.query(
    `SELECT * FROM antecedent_surgical WHERE antecedent_id = $1 ORDER BY created_at DESC;`,
    [antecedentId],
  );
  return r.rows;
}

export async function replaceSurgical(client, antecedentId, rows, userId) {
  await client.query(
    `DELETE FROM antecedent_surgical WHERE antecedent_id = $1;`,
    [antecedentId],
  );
  if (!rows?.length) return [];

  const values = [];
  const placeholders = [];
  rows.forEach((r, i) => {
    const base = i * 4;
    placeholders.push(
      `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`,
    );
    values.push(
      antecedentId,
      r.description ?? null,
      r.date_intervention ?? null,
      userId,
    );
  });

  const q = `
    INSERT INTO antecedent_surgical (antecedent_id, description, date_intervention, created_by)
    VALUES ${placeholders.join(", ")}
    RETURNING *;
  `;
  const res = await client.query(q, values);
  return res.rows;
}

export async function getTransfusion(client, antecedentId) {
  const r = await client.query(
    `SELECT * FROM antecedent_transfusion WHERE antecedent_id = $1 ORDER BY created_at DESC;`,
    [antecedentId],
  );
  return r.rows;
}

export async function replaceTransfusion(client, antecedentId, rows, userId) {
  await client.query(
    `DELETE FROM antecedent_transfusion WHERE antecedent_id = $1;`,
    [antecedentId],
  );
  if (!rows?.length) return [];

  const values = [];
  const placeholders = [];
  rows.forEach((r, i) => {
    const base = i * 3;
    placeholders.push(`($${base + 1}, $${base + 2}, $${base + 3})`);
    values.push(antecedentId, r.date_transfusion ?? null, userId);
  });

  const q = `
    INSERT INTO antecedent_transfusion (antecedent_id, date_transfusion, created_by)
    VALUES ${placeholders.join(", ")}
    RETURNING *;
  `;
  const res = await client.query(q, values);
  return res.rows;
}

export async function getAes(client, antecedentId) {
  const r = await client.query(
    `SELECT * FROM antecedent_aes WHERE antecedent_id = $1 ORDER BY created_at DESC;`,
    [antecedentId],
  );
  return r.rows;
}

export async function replaceAes(client, antecedentId, rows, userId) {
  await client.query(`DELETE FROM antecedent_aes WHERE antecedent_id = $1;`, [
    antecedentId,
  ]);
  if (!rows?.length) return [];

  const values = [];
  const placeholders = [];
  rows.forEach((r, i) => {
    const base = i * 3;
    placeholders.push(`($${base + 1}, $${base + 2}, $${base + 3})`);
    values.push(antecedentId, r.date_aes ?? null, userId);
  });

  const q = `
    INSERT INTO antecedent_aes (antecedent_id, date_aes, created_by)
    VALUES ${placeholders.join(", ")}
    RETURNING *;
  `;
  const res = await client.query(q, values);
  return res.rows;
}

// ---------- Versions list / get by patient + version ----------
export async function getAntecedentVersionsByPatientId(client, patientId) {
  const r = await client.query(
    `
    SELECT *
    FROM antecedents
    WHERE patient_id = $1
    ORDER BY version_number DESC;
    `,
    [patientId],
  );
  return r.rows;
}

export async function getAntecedentByPatientIdAndVersionNumber(
  client,
  patientId,
  versionNumber,
) {
  const r = await client.query(
    `
    SELECT *
    FROM antecedents
    WHERE patient_id = $1 AND version_number = $2
    LIMIT 1;
    `,
    [patientId, versionNumber],
  );
  return r.rows[0] || null;
}

//exemple : de upset et get pour la table medical. On peut faire la même chose pour les autres tables d'antécédents (infectious, therapeutic, family, gyneco) en réutilisant le même code générique upsertOneToOne et getOneToOne.
// export async function upsertAntecedentMedical(client, antecedentId, data, userId) {
//   const {
//     diabete = false,
//     hypertension = false,
//     cardiopathies = false,
//     insuffisance_renale = false,
//     maladies_hepatiques = false,
//     asthme_bpco = false,
//     cancers = false,
//     autres = null,
//   } = data || {};

//   const r = await client.query(
//     `
//     INSERT INTO antecedent_medical (
//       antecedent_id,
//       diabete, hypertension, cardiopathies, insuffisance_renale,
//       maladies_hepatiques, asthme_bpco, cancers, autres,
//       updated_by, updated_at
//     )
//     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())
//     ON CONFLICT (antecedent_id)   //si antecedent_id existe déjà → faire UPDATE (indique quoi faire si une insertion viole une contrainte UNIQUE ou PRIMARY KEY)
//     DO UPDATE SET
//       diabete = EXCLUDED.diabete,
//       hypertension = EXCLUDED.hypertension,
//       cardiopathies = EXCLUDED.cardiopathies,
//       insuffisance_renale = EXCLUDED.insuffisance_renale,
//       maladies_hepatiques = EXCLUDED.maladies_hepatiques,
//       asthme_bpco = EXCLUDED.asthme_bpco,
//       cancers = EXCLUDED.cancers,
//       autres = EXCLUDED.autres,
//       updated_by = EXCLUDED.updated_by,
//       updated_at = NOW()
//     RETURNING *;
//     `,
//     [
//       antecedentId,
//       diabete,
//       hypertension,
//       cardiopathies,
//       insuffisance_renale,
//       maladies_hepatiques,
//       asthme_bpco,
//       cancers,
//       autres,
//       userId,
//     ],
//   );

//   return r.rows[0] || null;
// }

// export async function getAntecedentMedical(client, antecedentId) {
//   const r = await client.query(
//     `SELECT * FROM antecedent_medical WHERE antecedent_id = $1;`,
//     [antecedentId],
//   );
//   return r.rows[0] || null;
// }
