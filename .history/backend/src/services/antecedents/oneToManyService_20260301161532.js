import {
  withClient,
  withTx,
  getPatientAndActive,
  requireActive,
} from "./_shared.js";
import {
  getSurgical,
  replaceSurgical,
  getTransfusion,
  replaceTransfusion,
  getAes,
  replaceAes,
  touchAntecedent,
} from "../../models/antecedents/index.js";

// Surgical
export async function getActiveSurgical(numero) {
  return withClient(async (client) => {
    const { patient, active } = await getPatientAndActive(client, numero);
    requireActive(active);
    return {
      patient,
      antecedent: active,
      surgical: await getSurgical(client, active.id),
    };
  });
}

export async function putActiveSurgical(numero, rows, userId) {
  return withTx(async (client) => {
    const { patient, active } = await getPatientAndActive(client, numero);
    requireActive(active);
    const surgical = await replaceSurgical(
      client,
      active.id,
      Array.isArray(rows) ? rows : [],
      userId,
    );
    await touchAntecedent(client, active.id, userId);
    return { patient, antecedent: active, surgical };
  });
}

// Transfusion
export async function getActiveTransfusion(numero) {
  return withClient(async (client) => {
    const { patient, active } = await getPatientAndActive(client, numero);
    requireActive(active);
    return {
      patient,
      antecedent: active,
      transfusion: await getTransfusion(client, active.id),
    };
  });
}

export async function putActiveTransfusion(numero, rows, userId) {
  return withTx(async (client) => {
    const { patient, active } = await getPatientAndActive(client, numero);
    requireActive(active);
    const transfusion = await replaceTransfusion(
      client,
      active.id,
      Array.isArray(rows) ? rows : [],
      userId,
    );
    await touchAntecedent(client, active.id, userId);
    return { patient, antecedent: active, transfusion };
  });
}

// AES
export async function getActiveAes(numero) {
  return withClient(async (client) => {
    const { patient, active } = await getPatientAndActive(client, numero);
    requireActive(active);
    return {
      patient,
      antecedent: active,
      aes: await getAes(client, active.id),
    };
  });
}

export async function putActiveAes(numero, rows, userId) {
  return withTx(async (client) => {
    const { patient, active } = await getPatientAndActive(client, numero);
    requireActive(active);
    const aes = await replaceAes(
      client,
      active.id,
      Array.isArray(rows) ? rows : [],
      userId,
    );
    await touchAntecedent(client, active.id, userId);
    return { patient, antecedent: active, aes };
  });
}
