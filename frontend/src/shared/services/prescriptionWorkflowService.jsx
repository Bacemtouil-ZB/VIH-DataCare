// =====================================================
// FRONTEND SERVICE - prescriptionWorkflowService.jsx
// =====================================================

import API from "../utils/api.js";
import { getStockItems } from "../../modules/Pharmacist/services/stockService.jsx";

// ── Normalizers ───────────────────────────────────────────────
const normalizePrescriptions = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.prescriptions)) return payload.prescriptions;
  if (Array.isArray(payload?.prescriptions?.prescriptions))
    return payload.prescriptions.prescriptions;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

// ── GET prescriptions par numéro de dossier ───────────────────
export const getPrescriptionsByNumeroDossier = async (numeroDossier) => {
  const response = await API.get(
    `/prescription-medicale/numero-dossier/${numeroDossier}`,
  );
  const payload = response.data;
  return {
    success: true,
    prescriptions: normalizePrescriptions(payload),
    patient: payload?.patient || payload?.prescriptions?.patient || null,
  };
};

// ── GET prescription par ID ───────────────────────────────────
export const getPrescriptionById = async (id) => {
  const response = await API.get(`/prescription-medicale/${id}`);
  return response.data;
};

// ── GET médicaments du stock (dropdown médecin) ───────────────
export const getStockMedicaments = async () => {
  const items = await getStockItems();
  return { items };
};

// ── POST créer une prescription (médecin) ─────────────────────
export const createPrescription = async (treatmentData) => {
  const response = await API.post("/prescription-medicale/add", treatmentData);
  return response.data;
};

// ── PATCH valider une prescription SANS modification (pharmacien) ─────
export const validatePrescription = async (id) => {
  const response = await API.patch(`/prescription-medicale/${id}/valider`);
  return response.data;
};

// ── PATCH valider une prescription AVEC modification (pharmacien) ─────
export const validatePrescriptionAvecModification = async (id, periodeModifiee) => {
  const response = await API.patch(
    `/prescription-medicale/${id}/valider-modifiee`,
    { periode_modifiee: periodeModifiee },
  );
  return response.data;
};

// ── GET dernière prescription par patient ─────────────────────
export const getLastPrescriptionPerPatient = async () => {
  const response = await API.get("/prescription-medicale/last-per-patient");
  return response.data?.data || {};
};

export default {
  getPrescriptionsByNumeroDossier,
  getPrescriptionById,
  getStockMedicaments,
  createPrescription,
  validatePrescription,
  validatePrescriptionAvecModification,
  getLastPrescriptionPerPatient,
};