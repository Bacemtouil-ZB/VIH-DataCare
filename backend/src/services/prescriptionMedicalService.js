import {
  createPrescriptionExamen    as createPrescriptionExamenModel,
  getPrescriptionsByNumeroDossier as getPrescriptionsByNumeroDossierModel,
  getPrescriptionById         as getPrescriptionByIdModel,
  updatePrescriptionExamen    as updatePrescriptionExamenModel,
} from "../models/prescriptionMedicalModel.js";


// ── CREATE ────────────────────────────────────────────────────────────────────
export const createPrescriptionExamen = async (data) => {
  const { numero_dossier, traitement, posologie, date } = data;

  if (!numero_dossier) throw new Error("Le numéro de dossier est obligatoire");
  if (!traitement)     throw new Error("Le médicament (traitement) est obligatoire");
  if (!posologie)      throw new Error("La posologie est obligatoire");
    data.date = new Date().toISOString().slice(0, 10);

  return await createPrescriptionExamenModel(data);
};

// ── GET BY NUMERO DOSSIER ─────────────────────────────────────────────────────
export const getPrescriptionsByNumeroDossier = async (numeroDossier) => {
  if (!numeroDossier) throw new Error("Le numéro de dossier est obligatoire");
  return await getPrescriptionsByNumeroDossierModel(numeroDossier);
};

// ── GET BY ID ─────────────────────────────────────────────────────────────────
export const getPrescriptionById = async (id) => {
  const prescription = await getPrescriptionByIdModel(id);
  if (!prescription) throw new Error("Prescription non trouvée");
  return prescription;
};

// ── UPDATE ────────────────────────────────────────────────────────────────────
export const updatePrescriptionExamen = async (id, data) => {
  const existing = await getPrescriptionByIdModel(id);
  if (!existing) throw new Error("Prescription non trouvée");

  return await updatePrescriptionExamenModel(id, data);
};