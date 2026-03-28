
import {
  findByNumeroDossier as findByNumeroDossierModel,
  createPrescription  as createPrescriptionModel,
  validerPrescription as validerPrescriptionModel,
  findById,
  updateQuantiteDelivree as updateQuantiteDelivreeModel
  , findLastPrescriptionPerPatient
} from "../models/prescriptionWorkflowModel.js";
import { getPatientByNumero } from "../models/patientModel.js";

// ── GET — liste des prescriptions d'un patient ────────────────
export const getPrescriptions = async (numeroDossier) => {
  const patient = await getPatientByNumero(numeroDossier);
  if (!patient) throw new Error(`Patient ${numeroDossier} non trouve`);

  const prescriptions = await findByNumeroDossierModel(numeroDossier);
  return { prescriptions, patient };
};


export const addPrescription = async (body, medecinId) => {
  const {numero_dossier, medicament_id, posologie, dosage, quantite, remarque } = body;
 
  // 1. Résolution patient
  if (!numero_dossier) throw new Error("numero_dossier est requis");
  const patient = await getPatientByNumero(numero_dossier);
  if (!patient) throw new Error(`Patient ${numero_dossier} non trouve`);

  const qty = Number(quantite);
  if (!Number.isInteger(qty) || qty <= 0) {
    throw new Error("La quantite prescrite doit etre un entier superieur a 0");
  }

  // 3. Insertion
  const prescription = await createPrescriptionModel({
    patient_id:    patient.id,
    medecin_id:    medecinId,
    medicament_id: Number(medicament_id),
    posologie:     posologie.trim(),
    dosage:        dosage   || null,
    quantite:      qty,
    remarque:      remarque || null,
  });

  return prescription;
};

// ── VALIDER — livrer une prescription ─────────────────────────
export const valider = async (id) => {
  const prescription = await findById(id);
  if (prescription.statut === "delivree") {
    throw new Error("Cette prescription est deja delivree");
  }

  return validerPrescriptionModel(id);
};
export const updateQuantiteDelivree = async (prescriptionId, quantiteDelivree) => {
  
  const qte = parseInt(quantiteDelivree, 10);
  if (!Number.isInteger(qte) || qte < 0) throw new Error("Quantité invalide");
  
  return await updateQuantiteDelivreeModel(id, qte);
};

export const getLastPrescriptionPerPatient = async () => {
  return findLastPrescriptionPerPatient();
};

