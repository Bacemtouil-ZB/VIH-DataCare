import {
  createBilanExamen    as createBilanExamenModel,
  getBilansByNumeroDossier as getBilansByNumeroDossierModel,
  getBilanById         as getBilanByIdModel,
  updateBilanExamen    as updateBilanExamenModel,
} from "../models/bilanExamenModel.js";

// ── CREATE ────────────────────────────────────────────────────────────────────
export const createBilanExamen = async (data) => {
  if (!data.numero_dossier)
    throw new Error("Le numéro de dossier est obligatoire");

  // Date par défaut = aujourd'hui
  if (!data.date) data.date = new Date().toISOString().slice(0, 10);

  return await createBilanExamenModel(data);
};

// ── GET BY NUMERO DOSSIER ─────────────────────────────────────────────────────
export const getBilansByNumeroDossier = async (numeroDossier) => {
  if (!numeroDossier)
    throw new Error("Le numéro de dossier est obligatoire");
  return await getBilansByNumeroDossierModel(numeroDossier);
};

// ── GET BY ID ─────────────────────────────────────────────────────────────────
export const getBilanById = async (id) => {
  const bilan = await getBilanByIdModel(id);
  if (!bilan) throw new Error("Bilan non trouvé");
  return bilan;
};

// ── UPDATE ────────────────────────────────────────────────────────────────────
export const updateBilanExamen = async (id, data) => {
  const existing = await getBilanByIdModel(id);
  if (!existing) throw new Error("Bilan non trouvé");
  return await updateBilanExamenModel(id, data);
};

// ── Helper : patient_id depuis numero dossier ─────────────────────────────────
export const getPatientIdByNumero = async (numeroDossier) => {
  const bilans = await getBilansByNumeroDossierModel(numeroDossier);
  return bilans?.[0]?.patient_id || null;
};