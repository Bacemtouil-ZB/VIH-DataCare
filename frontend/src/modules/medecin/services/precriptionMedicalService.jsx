import API from "../../../shared/utils/api";
import { getStockItems } from "../../../modules/Pharmacist/services/stockService.jsx";

// POST — créer une prescription
// body: { numero_dossier, medicament_id, traitement, posologie, dosage, date, quantite, remarque, statut }
export const createPrescription = async (data) => {
  const res = await API.post("/prescription-medicale/add", data);
  return res.data;
};

// GET — toutes les prescriptions d'un patient via numéro de dossier
export const getPrescriptionsByNumeroDossier = async (numeroDossier) => {
  const res = await API.get(`/prescription-medicale/patient/${numeroDossier}`);
  return res.data; // { success, prescriptions: [...] }
};

// PUT — modifier une prescription existante
export const updatePrescription = async (id, data) => {
  const res = await API.put(`/prescription-medicale/update/${id}`, data);
  return res.data; // { success, prescription: {...} }
};

// GET — liste médicaments du stock pour le dropdown
// Réutilise getStockItems du stockService (évite le 403 sur /stock)
export const getStockMedicaments = async () => {
  const items = await getStockItems();
  return { items }; // même format attendu par le composant : stockRes.items
};