import { withClient, withTx, getPatientAndActive } from "./_shared.js";
import {
  getPatientByNumero,
  getActiveAntecedentByPatientId,
  createAntecedent,
  archiveAntecedent,
} from "../../models/antecedents/index.js";

// Header
export async function getActiveHeader(numero) {
  return withClient(async (client) => {
    const { patient, active } = await getPatientAndActive(client, numero);
    return { patient, antecedent: active }; // active can be null
  });
}

// Versioning: archive active + create a new empty active header
export async function createNewVersion(numero, userId) {
  return withTx(async (client) => {
    const patient = await getPatientByNumero(client, numero);
    if (!patient) {
      const err = new Error("Patient not found");
      err.statusCode = 404;
      throw err;
    }

    const current = await getActiveAntecedentByPatientId(client, patient.id);
    const nextVersion = current ? current.version_number + 1 : 1;

    if (current) await archiveAntecedent(client, current.id, userId);

    const created = await createAntecedent(client, {
      patientId: patient.id,
      versionNumber: nextVersion,
      userId,
    });

    return { patient, antecedent: created };
  });
}
