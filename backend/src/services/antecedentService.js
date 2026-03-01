// import pool from "../config/db.js";
// import {
//   getPatientByNumero,
//   getActiveAntecedentByPatientId,
//   createAntecedent,
//   archiveAntecedent,
//   touchAntecedent,
//   // 1-1
//   getMedical,
//   upsertMedical,
//   getInfectious,
//   upsertInfectious,
//   getTherapeutic,
//   upsertTherapeutic,
//   getFamily,
//   upsertFamily,
//   getGyneco,
//   upsertGyneco,
//   // 1-N
//   getSurgical,
//   replaceSurgical,
//   getTransfusion,
//   replaceTransfusion,
//   getAes,
//   replaceAes,
//   // versions
//   getAntecedentVersionsByPatientId,
//   getAntecedentByPatientIdAndVersionNumber,
// } from "../models/antecedentModel.js";

// function requireActive(active) {
//   if (!active) {
//     const err = new Error("No active antecedent");
//     err.statusCode = 404;
//     throw err;
//   }
// }

// async function getPatientAndActive(client, numero) {
//   const patient = await getPatientByNumero(client, numero);
//   if (!patient) {
//     const err = new Error("Patient not found");
//     err.statusCode = 404;
//     throw err;
//   }
//   const active = await getActiveAntecedentByPatientId(client, patient.id);
//   return { patient, active };
// }

// // Header
// export async function getActiveHeader(numero) {
//   const client = await pool.connect();
//   try {
//     const { patient, active } = await getPatientAndActive(client, numero);
//     return { patient, antecedent: active }; // active peut être null
//   } finally {
//     client.release();
//   }
// }

// // Versioning: archive actif + créer un nouveau header actif (vide)
// export async function createNewVersion(numero, userId) {
//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");

//     const patient = await getPatientByNumero(client, numero);
//     if (!patient) {
//       const err = new Error("Patient not found");
//       err.statusCode = 404;
//       throw err;
//     }

//     const current = await getActiveAntecedentByPatientId(client, patient.id);
//     const nextVersion = current ? current.version_number + 1 : 1;

//     if (current) await archiveAntecedent(client, current.id, userId);

//     const created = await createAntecedent(client, {
//       patientId: patient.id,
//       versionNumber: nextVersion,
//       userId,
//     });

//     await client.query("COMMIT");
//     return { patient, antecedent: created };
//   } catch (e) {
//     await client.query("ROLLBACK");
//     throw e;
//   } finally {
//     client.release();
//   }
// }

// // 1-1 sections
// export async function getActiveMedical(numero) {
//   const client = await pool.connect();
//   try {
//     const { patient, active } = await getPatientAndActive(client, numero);
//     requireActive(active);
//     return {
//       patient,
//       antecedent: active,
//       medical: await getMedical(client, active.id),
//     };
//   } finally {
//     client.release();
//   }
// }

// export async function putActiveMedical(numero, payload, userId) {
//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");
//     const { patient, active } = await getPatientAndActive(client, numero);
//     requireActive(active);

//     const medical = await upsertMedical(client, active.id, payload, userId);
//     await touchAntecedent(client, active.id, userId);

//     await client.query("COMMIT");
//     return { patient, antecedent: active, medical };
//   } catch (e) {
//     await client.query("ROLLBACK");
//     throw e;
//   } finally {
//     client.release();
//   }
// }

// // Infectious
// export async function getActiveInfectious(numero) {
//   const client = await pool.connect();
//   try {
//     const { patient, active } = await getPatientAndActive(client, numero);
//     requireActive(active);
//     return {
//       patient,
//       antecedent: active,
//       infectious: await getInfectious(client, active.id),
//     };
//   } finally {
//     client.release();
//   }
// }

// export async function putActiveInfectious(numero, payload, userId) {
//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");
//     const { patient, active } = await getPatientAndActive(client, numero);
//     requireActive(active);

//     const infectious = await upsertInfectious(
//       client,
//       active.id,
//       payload,
//       userId,
//     );
//     await touchAntecedent(client, active.id, userId);

//     await client.query("COMMIT");
//     return { patient, antecedent: active, infectious };
//   } catch (e) {
//     await client.query("ROLLBACK");
//     throw e;
//   } finally {
//     client.release();
//   }
// }

// // Therapeutic
// export async function getActiveTherapeutic(numero) {
//   const client = await pool.connect();
//   try {
//     const { patient, active } = await getPatientAndActive(client, numero);
//     requireActive(active);
//     return {
//       patient,
//       antecedent: active,
//       therapeutic: await getTherapeutic(client, active.id),
//     };
//   } finally {
//     client.release();
//   }
// }

// export async function putActiveTherapeutic(numero, payload, userId) {
//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");
//     const { patient, active } = await getPatientAndActive(client, numero);
//     requireActive(active);

//     const therapeutic = await upsertTherapeutic(
//       client,
//       active.id,
//       payload,
//       userId,
//     );
//     await touchAntecedent(client, active.id, userId);

//     await client.query("COMMIT");
//     return { patient, antecedent: active, therapeutic };
//   } catch (e) {
//     await client.query("ROLLBACK");
//     throw e;
//   } finally {
//     client.release();
//   }
// }

// // Family
// export async function getActiveFamily(numero) {
//   const client = await pool.connect();
//   try {
//     const { patient, active } = await getPatientAndActive(client, numero);
//     requireActive(active);
//     return {
//       patient,
//       antecedent: active,
//       family: await getFamily(client, active.id),
//     };
//   } finally {
//     client.release();
//   }
// }

// export async function putActiveFamily(numero, payload, userId) {
//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");
//     const { patient, active } = await getPatientAndActive(client, numero);
//     requireActive(active);

//     const family = await upsertFamily(client, active.id, payload, userId);
//     await touchAntecedent(client, active.id, userId);

//     await client.query("COMMIT");
//     return { patient, antecedent: active, family };
//   } catch (e) {
//     await client.query("ROLLBACK");
//     throw e;
//   } finally {
//     client.release();
//   }
// }

// // Gyneco
// export async function getActiveGyneco(numero) {
//   const client = await pool.connect();
//   try {
//     const { patient, active } = await getPatientAndActive(client, numero);
//     requireActive(active);
//     return {
//       patient,
//       antecedent: active,
//       gyneco: await getGyneco(client, active.id),
//     };
//   } finally {
//     client.release();
//   }
// }

// export async function putActiveGyneco(numero, payload, userId) {
//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");
//     const { patient, active } = await getPatientAndActive(client, numero);
//     requireActive(active);

//     const gyneco = await upsertGyneco(client, active.id, payload, userId);
//     await touchAntecedent(client, active.id, userId);

//     await client.query("COMMIT");
//     return { patient, antecedent: active, gyneco };
//   } catch (e) {
//     await client.query("ROLLBACK");
//     throw e;
//   } finally {
//     client.release();
//   }
// }

// // 1-N replace
// export async function getActiveSurgical(numero) {
//   const client = await pool.connect();
//   try {
//     const { patient, active } = await getPatientAndActive(client, numero);
//     requireActive(active);
//     return {
//       patient,
//       antecedent: active,
//       surgical: await getSurgical(client, active.id),
//     };
//   } finally {
//     client.release();
//   }
// }

// export async function putActiveSurgical(numero, rows, userId) {
//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");
//     const { patient, active } = await getPatientAndActive(client, numero);
//     requireActive(active);

//     const surgical = await replaceSurgical(
//       client,
//       active.id,
//       Array.isArray(rows) ? rows : [],
//       userId,
//     );
//     await touchAntecedent(client, active.id, userId);

//     await client.query("COMMIT");
//     return { patient, antecedent: active, surgical };
//   } catch (e) {
//     await client.query("ROLLBACK");
//     throw e;
//   } finally {
//     client.release();
//   }
// }

// export async function getActiveTransfusion(numero) {
//   const client = await pool.connect();
//   try {
//     const { patient, active } = await getPatientAndActive(client, numero);
//     requireActive(active);
//     return {
//       patient,
//       antecedent: active,
//       transfusion: await getTransfusion(client, active.id),
//     };
//   } finally {
//     client.release();
//   }
// }

// export async function putActiveTransfusion(numero, rows, userId) {
//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");
//     const { patient, active } = await getPatientAndActive(client, numero);
//     requireActive(active);

//     const transfusion = await replaceTransfusion(
//       client,
//       active.id,
//       Array.isArray(rows) ? rows : [],
//       userId,
//     );
//     await touchAntecedent(client, active.id, userId);

//     await client.query("COMMIT");
//     return { patient, antecedent: active, transfusion };
//   } catch (e) {
//     await client.query("ROLLBACK");
//     throw e;
//   } finally {
//     client.release();
//   }
// }

// export async function getActiveAes(numero) {
//   const client = await pool.connect();
//   try {
//     const { patient, active } = await getPatientAndActive(client, numero);
//     requireActive(active);
//     return {
//       patient,
//       antecedent: active,
//       aes: await getAes(client, active.id),
//     };
//   } finally {
//     client.release();
//   }
// }

// export async function putActiveAes(numero, rows, userId) {
//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");
//     const { patient, active } = await getPatientAndActive(client, numero);
//     requireActive(active);

//     const aes = await replaceAes(
//       client,
//       active.id,
//       Array.isArray(rows) ? rows : [],
//       userId,
//     );
//     await touchAntecedent(client, active.id, userId);

//     await client.query("COMMIT");
//     return { patient, antecedent: active, aes };
//   } catch (e) {
//     await client.query("ROLLBACK");
//     throw e;
//   } finally {
//     client.release();
//   }
// }
// //--------------------versions--------------------
// // Versions
// async function requirePatient(client, numero) {
//   const patient = await getPatientByNumero(client, numero);
//   if (!patient) {
//     const err = new Error("Patient not found");
//     err.statusCode = 404;
//     throw err;
//   }
//   return patient;
// }

// async function requireAntecedentVersion(client, patientId, versionNumber) {
//   const antecedent = await getAntecedentByPatientIdAndVersionNumber(
//     client,
//     patientId,
//     Number(versionNumber),
//   );
//   if (!antecedent) {
//     const err = new Error("Antecedent version not found");
//     err.statusCode = 404;
//     throw err;
//   }
//   return antecedent;
// }

// // List headers (active + archived)
// export async function getVersions(numero) {
//   const client = await pool.connect();
//   try {
//     const patient = await requirePatient(client, numero);
//     const versions = await getAntecedentVersionsByPatientId(client, patient.id);
//     return { patient, versions };
//   } finally {
//     client.release();
//   }
// }

// // Snapshot (recommended): header + all sections for a version
// export async function getVersionSnapshot(numero, versionNumber) {
//   const client = await pool.connect();
//   try {
//     const patient = await requirePatient(client, numero);
//     const antecedent = await requireAntecedentVersion(
//       client,
//       patient.id,
//       versionNumber,
//     );

//     const antecedentId = antecedent.id;

//     const [
//       medical,
//       infectious,
//       therapeutic,
//       family,
//       gyneco,
//       surgical,
//       transfusion,
//       aes,
//     ] = await Promise.all([
//       getMedical(client, antecedentId),
//       getInfectious(client, antecedentId),
//       getTherapeutic(client, antecedentId),
//       getFamily(client, antecedentId),
//       getGyneco(client, antecedentId),
//       getSurgical(client, antecedentId),
//       getTransfusion(client, antecedentId),
//       getAes(client, antecedentId),
//     ]);

//     return {
//       patient,
//       antecedent,
//       medical,
//       infectious,
//       therapeutic,
//       family,
//       gyneco,
//       surgical,
//       transfusion,
//       aes,
//     };
//   } finally {
//     client.release();
//   }
// }
