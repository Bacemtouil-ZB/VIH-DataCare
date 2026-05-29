import pool from "../config/db.js";

let permissionTableReady = false;

const ensurePermissionTable = async () => {
  if (permissionTableReady) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS permissions (
      id                  SERIAL PRIMARY KEY , 
      patient_id          INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      medecin_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      can_view_viral_load BOOLEAN DEFAULT false,
      can_view_cd4        BOOLEAN DEFAULT false,
      granted_at          TIMESTAMP DEFAULT NOW(),
      expires_at          TIMESTAMP NOT NULL,
      UNIQUE (patient_id, medecin_id)
    );
  `);

  permissionTableReady = true;
};

// numero => patientId
export const findPatientIdByNumero = async (numero) => {
  const result = await pool.query(
    `SELECT id FROM patients WHERE numero = $1`,
    [numero]
  );
  return result.rows[0]?.id ?? null;
};

export const upsertPermission = async ({
  patientId,
  medecinId,
  canViewViralLoad,
  canViewCd4,
  expiresAt,
}) => {
  await ensurePermissionTable();

  const result = await pool.query(
    `INSERT INTO permissions
       (patient_id, medecin_id, can_view_viral_load, can_view_cd4, granted_at, expires_at)
     VALUES ($1, $2, $3, $4, NOW(), $5)
     ON CONFLICT (patient_id, medecin_id)
     DO UPDATE SET
       can_view_viral_load = EXCLUDED.can_view_viral_load,
       can_view_cd4        = EXCLUDED.can_view_cd4,
       granted_at          = NOW(),
       expires_at          = EXCLUDED.expires_at
     RETURNING *;`,
    [patientId, medecinId, canViewViralLoad, canViewCd4, expiresAt]
  );

  return result.rows[0];
};

export const findActivePermission = async (patientId) => {
  await ensurePermissionTable();

  const result = await pool.query(
    `SELECT can_view_viral_load, can_view_cd4, expires_at
     FROM permissions
     WHERE patient_id = $1
       AND expires_at > NOW()
     ORDER BY granted_at DESC
     LIMIT 1;`,
    [patientId]
  );

  return result.rows[0] ?? null;
};

export const findPermissionByPatientId = async (patientId) => {
  await ensurePermissionTable();

  const result = await pool.query(
    `SELECT * FROM permissions
     WHERE patient_id = $1
     ORDER BY granted_at DESC
     LIMIT 1;`,
    [patientId]
  );

  return result.rows[0] ?? null;
};