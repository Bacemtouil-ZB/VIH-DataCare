// ---------- Antecedent header (table antecedents) ----------
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

// touchAntecedent: when a sub-table changes, update antecedent updated_at
export async function touchAntecedent(client, antecedentId, userId) {
  await client.query(
    `UPDATE antecedents SET updated_by=$2, updated_at=NOW() WHERE id=$1;`,
    [antecedentId, userId],
  );
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
