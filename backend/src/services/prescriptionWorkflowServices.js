
import {
  findByNumeroDossier as findByNumeroDossierModel,
  createPrescription as createPrescriptionModel,
  validerPrescription as validerPrescriptionModel,
  validerAvecModification as validerAvecModificationModel,
  supprimerPrescriptionsExpirees as supprimerPrescriptionsExpireesModel,
  findById,
  findLastPrescriptionPerPatient,
} from "../models/prescriptionWorkflowModel.js";
import { getPatientByNumero } from "../services/patientService.js";

// ── GET — liste des prescriptions d'un patient ────────────────
export const getPrescriptions = async (numeroDossier) => {
  const patient = await getPatientByNumero(numeroDossier);
  if (!patient) throw new Error(`Patient ${numeroDossier} non trouve`);

  const prescriptions = await findByNumeroDossierModel(numeroDossier);
  return { prescriptions, patient };
};

// ── POST — ajouter une prescription ───────────────────────────
export const addPrescription = async (body, medecinId) => {
  const { numero_dossier, medicament_id, posologie, periode, remarque } = body;

  // 1. Résolution patient
  if (!numero_dossier) throw new Error("numero_dossier est requis");
  const patient = await getPatientByNumero(numero_dossier);
  if (!patient) throw new Error(`Patient ${numero_dossier} non trouve`);

  const pd = Number(periode);
  if (!Number.isInteger(pd) || pd <= 0) {
    throw new Error("La periode prescrite doit etre un entier superieur a 0");
  }

  // 2. Insertion
  const prescription = await createPrescriptionModel({
    patient_id: patient.id,
    medecin_id: medecinId,
    medicament_id: Number(medicament_id),
    posologie: posologie || null,
    periode: pd,
    remarque: remarque || null,
  });

  return prescription;
};

// ── PATCH — valider une prescription (Scénario 1) ─────────────
export const valider = async (id) => {
  const prescription = await findById(id);
  
  if (!prescription) {
    throw new Error("Prescription non trouvee");
  }
  
  if (prescription.statut === "delivree" || prescription.statut === "modifie") {
    throw new Error("Cette prescription est deja validee");
  }

  return validerPrescriptionModel(id);
};

// ── PATCH — valider avec modification (Scénario 2) ────────────
export const validerAvecModification = async (id, periodeModifiee) => {
  const prescription = await findById(id);

  if (!prescription) {
    throw new Error("Prescription non trouvee");
  }

  if (prescription.statut === "delivree" || prescription.statut === "modifie") {
    throw new Error("Cette prescription est deja validee");
  }

  const pm = Number(periodeModifiee);
  if (!Number.isInteger(pm) || pm <= 0) {
    throw new Error("La periode modifiee doit etre un entier superieur a 0");
  }

  if (pm > prescription.periode) {
    throw new Error("La periode modifiee ne peut pas depasser la periode prescrite");
  }

  return validerAvecModificationModel(id, pm);
};

// ── CRON — supprimer prescriptions expirées ───────────────────
export const supprimerPrescriptionsExpirees = async () => {
  return supprimerPrescriptionsExpireesModel();
};

// ── GET — dernière prescription par patient ───────────────────
export const getLastPrescriptionPerPatient = async () => {
  return findLastPrescriptionPerPatient();
};