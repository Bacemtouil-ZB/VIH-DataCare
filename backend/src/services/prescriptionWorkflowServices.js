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
  const { numero_dossier, medicament_ids, posologie, periode, remarque } = body;

  if (!numero_dossier) throw new Error("numero_dossier est requis");

  if (!Array.isArray(medicament_ids) || medicament_ids.length === 0) {
    throw new Error("Au moins un medicament est requis");
  }

  const patient = await getPatientByNumero(numero_dossier);
  if (!patient) throw new Error(`Patient ${numero_dossier} non trouve`);

  const pd = Number(periode);
  if (!Number.isInteger(pd) || pd <= 0) {
    throw new Error("La periode prescrite doit etre un entier superieur a 0");
  }

  return createPrescriptionModel({
    patient_id: patient.id,
    medecin_id: medecinId,
    medicament_ids: medicament_ids.map(Number),
    posologie: posologie || null,
    periode: pd,
    remarque: remarque || null,
  });
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
  const prescribedPeriod = Number(prescription.periode);
  if (!Number.isInteger(pm) || pm <= 0) {
    throw new Error("La periode modifiee doit etre un entier superieur a 0");
  }

  if (!Number.isInteger(prescribedPeriod) || prescribedPeriod <= 1) {
    throw new Error("La periode prescrite par le medecin ne permet pas de reduction");
  }

  if (pm >= prescribedPeriod) {
    throw new Error("La periode modifiee doit etre strictement inferieure a la periode prescrite");
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
