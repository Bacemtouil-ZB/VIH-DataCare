import {
  createConclusion,
  getConclusionsByPatient,
  countConclusionsByPatient,
  updateConclusion,
  getConclusionById,
} from "../models/doctorConclusionsModel";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export const createConclusionService = async ({
  patient_id,
  doctor_id,
  content,
}) => {
  if (!patient_id || Number.isNaN(Number(patient_id)))
    throw new Error("patient_id invalide");
  if (!content || String(content).trim().length < 5)
    throw new Error("Contenu obligatoire (min 5 caractères)");

  const conclusion = await createConclusion({ patient_id, doctor_id, content });
  return { conclusion };
};

export const listConclusionsByPatientService = async ({
  patient_id,
  limit,
  offset,
}) => {
  if (!patient_id || Number.isNaN(Number(patient_id)))
    throw new Error("patient_id invalide");
  const lim = clamp(Number(limit || 10), 1, 50);
  const off = clamp(Number(offset || 0), 0, 1_000_000);

  const [conclusions, total] = await Promise.all([
    getConclusionsByPatient({ patient_id, limit: lim, offset: off }),
    countConclusionsByPatient({ patient_id }),
  ]);

  return { conclusions, total, limit: lim, offset: off };
};

export const getConclusionDetailsService = async ({ id }) => {
  const c = await getConclusionById({ id });
  if (!c) throw new Error("Conclusion introuvable");
  return { conclusion: c };
};

export const updateConclusionService = async ({ id, doctor_id, content }) => {
  if (!content || String(content).trim().length < 5)
    throw new Error("Contenu obligatoire (min 5 caractères)");
  const updated = await updateConclusion({ id, doctor_id, content });
  if (!updated) throw new Error("Conclusion introuvable ou non autorisé");
  return { conclusion: updated };
};
