import {
  withClient,
  withTx,
  getPatientAndActive,
  requireActive,
} from "./_shared.js";
import {
  getMedical,
  upsertMedical,
  getInfectious,
  upsertInfectious,
  getTherapeutic,
  upsertTherapeutic,
  getFamily,
  upsertFamily,
  getGyneco,
  upsertGyneco,
  touchAntecedent,
} from "../../models/antecedents/index.js";

// Medical
export async function getActiveMedical(numero) {
  return withClient(async (client) => {
    const { patient, active } = await getPatientAndActive(client, numero);
    requireActive(active);
    return {
      patient,
      antecedent: active,
      medical: await getMedical(client, active.id),
    };
  });
}

export async function putActiveMedical(numero, payload, userId) {
  return withTx(async (client) => {
    const { patient, active } = await getPatientAndActive(client, numero);
    requireActive(active);
    const medical = await upsertMedical(client, active.id, payload, userId);
    await touchAntecedent(client, active.id, userId);
    return { patient, antecedent: active, medical };
  });
}

// Infectious
export async function getActiveInfectious(numero) {
  return withClient(async (client) => {
    const { patient, active } = await getPatientAndActive(client, numero);
    requireActive(active);
    return {
      patient,
      antecedent: active,
      infectious: await getInfectious(client, active.id),
    };
  });
}

export async function putActiveInfectious(numero, payload, userId) {
  return withTx(async (client) => {
    const { patient, active } = await getPatientAndActive(client, numero);
    requireActive(active);
    const infectious = await upsertInfectious(
      client,
      active.id,
      payload,
      userId,
    );
    await touchAntecedent(client, active.id, userId);
    return { patient, antecedent: active, infectious };
  });
}

// Therapeutic
export async function getActiveTherapeutic(numero) {
  return withClient(async (client) => {
    const { patient, active } = await getPatientAndActive(client, numero);
    requireActive(active);
    return {
      patient,
      antecedent: active,
      therapeutic: await getTherapeutic(client, active.id),
    };
  });
}

export async function putActiveTherapeutic(numero, payload, userId) {
  return withTx(async (client) => {
    const { patient, active } = await getPatientAndActive(client, numero);
    requireActive(active);
    const therapeutic = await upsertTherapeutic(
      client,
      active.id,
      payload,
      userId,
    );
    await touchAntecedent(client, active.id, userId);
    return { patient, antecedent: active, therapeutic };
  });
}

// Family
export async function getActiveFamily(numero) {
  return withClient(async (client) => {
    const { patient, active } = await getPatientAndActive(client, numero);
    requireActive(active);
    return {
      patient,
      antecedent: active,
      family: await getFamily(client, active.id),
    };
  });
}

export async function putActiveFamily(numero, payload, userId) {
  return withTx(async (client) => {
    const { patient, active } = await getPatientAndActive(client, numero);
    requireActive(active);
    const family = await upsertFamily(client, active.id, payload, userId);
    await touchAntecedent(client, active.id, userId);
    return { patient, antecedent: active, family };
  });
}

// Gyneco
export async function getActiveGyneco(numero) {
  return withClient(async (client) => {
    const { patient, active } = await getPatientAndActive(client, numero);
    requireActive(active);
    return {
      patient,
      antecedent: active,
      gyneco: await getGyneco(client, active.id),
    };
  });
}

export async function putActiveGyneco(numero, payload, userId) {
  return withTx(async (client) => {
    const { patient, active } = await getPatientAndActive(client, numero);
    requireActive(active);
    const gyneco = await upsertGyneco(client, active.id, payload, userId);
    await touchAntecedent(client, active.id, userId);
    return { patient, antecedent: active, gyneco };
  });
}
