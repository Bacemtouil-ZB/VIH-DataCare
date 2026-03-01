import { withClient, requirePatient } from "./_shared.js";
import {
  getAntecedentVersionsByPatientId,
  getAntecedentByPatientIdAndVersionNumber,
  // sections getters
  getMedical,
  getInfectious,
  getTherapeutic,
  getFamily,
  getGyneco,
  getSurgical,
  getTransfusion,
  getAes,
} from "../../models/antecedents/index.js";

async function requireAntecedentVersion(client, patientId, versionNumber) {
  const antecedent = await getAntecedentByPatientIdAndVersionNumber(
    client,
    patientId,
    Number(versionNumber),
  );
  if (!antecedent) {
    const err = new Error("Antecedent version not found");
    err.statusCode = 404;
    throw err;
  }
  return antecedent;
}

// List headers (active + archived)
export async function getVersions(numero) {
  return withClient(async (client) => {
    const patient = await requirePatient(client, numero);
    const versions = await getAntecedentVersionsByPatientId(client, patient.id);
    return { patient, versions };
  });
}

// Snapshot: header + all sections for a version
export async function getVersionSnapshot(numero, versionNumber) {
  return withClient(async (client) => {
    const patient = await requirePatient(client, numero);
    const antecedent = await requireAntecedentVersion(
      client,
      patient.id,
      versionNumber,
    );

    const antecedentId = antecedent.id;

    const [
      medical,
      infectious,
      therapeutic,
      family,
      gyneco,
      surgical,
      transfusion,
      aes,
    ] = await Promise.all([
      getMedical(client, antecedentId),
      getInfectious(client, antecedentId),
      getTherapeutic(client, antecedentId),
      getFamily(client, antecedentId),
      getGyneco(client, antecedentId),
      getSurgical(client, antecedentId),
      getTransfusion(client, antecedentId),
      getAes(client, antecedentId),
    ]);

    return {
      patient,
      antecedent,
      medical,
      infectious,
      therapeutic,
      family,
      gyneco,
      surgical,
      transfusion,
      aes,
    };
  });
}
