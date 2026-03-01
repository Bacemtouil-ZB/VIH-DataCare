/*
header = table antecedents
getActiveAntecedentByPatientId : ORDER BY est une sécurité.

upsertMedical = INSERT / UPDATE antecedent_medical

*/

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
    ORDER BY created_at DESC
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
export async function touchAntecedent(client, antecedentId, userId) {
  await client.query(
    `UPDATE antecedents SET updated_by=$2, updated_at=NOW() WHERE id=$1;`,
    [antecedentId, userId],
  );
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
//     ON CONFLICT (antecedent_id)
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

//1-1 generic upsert + get pour éviter de dupliquer le code pour chaque table d'antécédent.
async function upsertOneToOne(client, table, antecedentId, payload, userId) {
  //payload = données envoyées par le formulaire

  const keys = Object.keys(payload || {}); // Si payload est null ou undefined, on utilise un objet vide.
  if (keys.length === 0) return null;

  const cols = keys.map((k) => `"${k}"`).join(", "); // On met les noms de colonnes entre guillemets pour éviter les problèmes avec les noms réservés ou les majuscules.
  const placeholders = keys.map((_, i) => `$${i + 2}`).join(", ");
  const updateSet = keys.map((k) => `"${k}" = EXCLUDED."${k}"`).join(", ");
  const values = [antecedentId, ...keys.map((k) => payload[k])];

  const q = `
    INSERT INTO ${table} (antecedent_id, ${cols}, updated_by, updated_at)
    VALUES ($1, ${placeholders}, $${values.length + 1}, NOW()) 
    ON CONFLICT (antecedent_id)
    DO UPDATE SET
      ${updateSet},
      updated_by = EXCLUDED.updated_by,
      updated_at = NOW()
    RETURNING *;
  `;

  const r = await client.query(q, [...values, userId]);
  return r.rows[0] || null;
}

async function getOneToOne(client, table, antecedentId) {
  const r = await client.query(
    `SELECT * FROM ${table} WHERE antecedent_id = $1;`,
    [antecedentId],
  );
  return r.rows[0] || null;
}

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

// ---------- 1-N replace mode: surgical / transfusion / aes ----------
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
