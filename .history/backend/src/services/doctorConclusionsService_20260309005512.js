import {
  createConclusion,
  updateConclusion,
  getConclusionById,
  listConclusionsByPatient,
  countConclusionsByPatient,
} from "../models/doctorConclusionsModel.js";
import { getPatientByNumero } from "../models/patientsModel.js"; // adapt to your project

// Helpers
const clampInt = (v, def, min, max) => {
  const n = Number.parseInt(v, 10);
  if (Number.isNaN(n)) return def;
  return Math.min(max, Math.max(min, n));
};

export async function createPatientConclusionService({
  patientNumero,
  doctorId,
  content,
}) {
  if (!content || String(content).trim().length < 5) {
    const err = new Error("Le contenu est obligatoire (min 5 caractères).");
    err.status = 400;
    throw err;
  }

  const patient = await getPatientByNumero({ numero: patientNumero }); // implement/adjust
  if (!patient) {
    const err = new Error("Patient introuvable.");
    err.status = 404;
    throw err;
  }

  const created = await createConclusion({
    patientId: patient.id,
    doctorId,
    content,
  });

  return {
    patient: { id: patient.id, numero: patient.numero },
    conclusion: created,
  };
}

export async function updatePatientConclusionService({
  id,
  doctorId,
  content,
}) {
  if (!content || String(content).trim().length < 5) {
    const err = new Error("Le contenu est obligatoire (min 5 caractères).");
    err.status = 400;
    throw err;
  }

  const updated = await updateConclusion({ id, doctorId, content });
  if (!updated) {
    const err = new Error("Conclusion introuvable (ou non autorisé).");
    err.status = 404;
    throw err;
  }

  return { conclusion: updated };
}

export async function listPatientConclusionsService({
  patientNumero,
  limit,
  offset,
}) {
  const patient = await getPatientByNumeroOrId({ numero: patientNumero });
  if (!patient) {
    const err = new Error("Patient introuvable.");
    err.status = 404;
    throw err;
  }

  const lim = clampInt(limit, 10, 1, 50);
  const off = clampInt(offset, 0, 0, 1_000_000);

  const [rows, total] = await Promise.all([
    listConclusionsByPatient({
      patientId: patient.id,
      limit: lim,
      offset: off,
    }),
    countConclusionsByPatient({ patientId: patient.id }),
  ]);

  return {
    patient: { id: patient.id, numero: patient.numero },
    conclusions: rows,
    total,
    limit: lim,
    offset: off,
  };
}

export async function getConclusionDetailsService({ id }) {
  const c = await getConclusionById({ id });
  if (!c) {
    const err = new Error("Conclusion introuvable.");
    err.status = 404;
    throw err;
  }
  return { conclusion: c };
}
