import {
  createConclusion,
  getConclusionsByPatient,
  countConclusionsByPatient,
  updateConclusion,
  getConclusionById,
} from "../models/doctorConclusionsModel.js";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export const createConclusionService = async ({
  numero,
  doctor_id,
  content,
}) => {
  if (!numero) throw new Error("numero patient obligatoire");

  if (!content || String(content).trim().length < 5)
    throw new Error("Contenu obligatoire (min 5 caractères)");

  const conclusion = await createConclusion({ numero, doctor_id, content });

  if (!conclusion) throw new Error("Patient introuvable");

  return { conclusion };
};

export const listConclusionsByPatientService = async ({
  numero,
  limit,
  offset,
}) => {
  if (!numero) throw new Error("numero patient obligatoire");

  const lim = clamp(Number(limit || 10), 1, 50);
  const off = clamp(Number(offset || 0), 0, 1_000_000);

  const [conclusions, total] = await Promise.all([
    getConclusionsByPatient({ numero, limit: lim, offset: off }),
    countConclusionsByPatient({ numero }),
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
