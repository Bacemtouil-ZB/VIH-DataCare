import pool from "../../config/db.js";
import {
  getPatientByNumero,
  getActiveAntecedentByPatientId,
} from "../../models/antecedents/index.js";

export function requireActive(active) {
  if (!active) {
    const err = new Error("No active antecedent");
    err.statusCode = 404;
    throw err;
  }
}

export async function getPatientAndActive(client, numero) {
  const patient = await getPatientByNumero(client, numero);
  if (!patient) {
    const err = new Error("Patient not found");
    err.statusCode = 404;
    throw err;
  }
  const active = await getActiveAntecedentByPatientId(client, patient.id);
  return { patient, active };
}

export async function requirePatient(client, numero) {
  const patient = await getPatientByNumero(client, numero);
  if (!patient) {
    const err = new Error("Patient not found");
    err.statusCode = 404;
    throw err;
  }
  return patient;
}

export async function withClient(fn) {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

export async function withTx(fn) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const res = await fn(client);
    await client.query("COMMIT");
    return res;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
