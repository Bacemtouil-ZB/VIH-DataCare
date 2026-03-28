import API from "../utils/api.js";
import { getStockItems } from "../../modules/Pharmacist/services/stockService.jsx";

// ── Normalizers ───────────────────────────────────────────────
const normalizePrescriptions = (payload) => {
  if (Array.isArray(payload))                              return payload;
  if (Array.isArray(payload?.prescriptions))               return payload.prescriptions;
  if (Array.isArray(payload?.prescriptions?.prescriptions)) return payload.prescriptions.prescriptions;
  if (Array.isArray(payload?.data))                        return payload.data;
  return [];
};

const normalizePrises = (payload) => {
  if (Array.isArray(payload))          return payload;
  if (Array.isArray(payload?.prises))  return payload.prises;
  if (Array.isArray(payload?.prises?.prises)) return payload.prises.prises;
  return [];
};

// ── GET prescriptions par numéro de dossier ───────────────────
// Utilisé par : médecin (usePrescreptionMedicalLogic) + pharmacien
export const getPrescriptionsByNumeroDossier = async (numeroDossier) => {
  const response = await API.get(`/prescription-medicale/numero-dossier/${numeroDossier}`);
  const payload  = response.data;
  return {
    success:       true,
    prescriptions: normalizePrescriptions(payload),
    patient:       payload?.patient || payload?.prescriptions?.patient || null,
  };
};


// ── GET prescription par ID ───────────────────────────────────
export const getPrescriptionById = async (id) => {
  const response = await API.get(`/prescription-medicale/${id}`);
  return response.data;
};

// ── GET médicaments du stock (dropdown médecin) ───────────────
// Réutilise getStockItems pour éviter le 403 sur /stock
export const getStockMedicaments = async () => {
  const items = await getStockItems();
  return { items };
};

// ── POST créer une prescription (médecin) ─────────────────────
export const createPrescription = async (treatmentData) => {
  const response = await API.post("/prescription-medicale/add", treatmentData);
  return response.data;
};

// ── PATCH valider une prescription (pharmacien) ───────────────
export const validatePrescription = async (id) => {
  const response = await API.patch(`/prescription-medicale/${id}/valider`);
  return response.data;
};

// ── PATCH mettre à jour la quantité délivrée (pharmacien) ─────
export const updateQuantiteDelivree = async (prescriptionId, quantiteDelivree) => {
  const response = await API.patch(
    `/prescription-medicale/${prescriptionId}/quantite-delivree`,
    { quantite_delivree: quantiteDelivree },
  );
  return response.data;
};

// ── PATCH date prochaine prise ────────────────────────────────
export const updateDateProchainePrise = async (id, dateProchainePrise) => {
  const response = await API.patch(`/prescription-medicale/${id}/date-prochaine-prise`, {
    date_prochaine_prise: dateProchainePrise,
  });
  return response.data;
};
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
  updateQuantiteDelivree,
  updateDateProchainePrise,
  getLastPrescriptionPerPatient,
};