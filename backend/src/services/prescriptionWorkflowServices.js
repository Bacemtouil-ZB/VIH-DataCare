import {
  addMedicalTreatment as addMedicalTreatmentModel,
  findMedicalTreatmentByNumeroDossier as findByNumeroModel,
  getThreeLastPrise as getThreeLastPriseModel,
  getTreatmentStartDate as getTreatmentStartDateModel,
  getNextIntakeDate as getNextIntakeDateModel,
  getPrescriptionById as getPrescriptionByIdModel,
  updatePrescription as updatePrescriptionModel,
  getPatientsPerduDeVue as getPatientsPerduDeVueModel,
  updateDateProchainePrise as updateDateProchainePriseModel,
  countPrescriptionsByStatut,
  validerPrescription as validerPrescriptionModel,
  upsertSuiviTherapeutique,
} from "../models/prescriptionWorkflowModel.js";
import { getPatientByNumero } from "../models/patientModel.js";
import { SuiviTherapeutique } from "./suiviTherapeutique/SuiviTherapeutique.js";

export const addMedicalTreatment = async (treatmentData, medecinId) => {
  if (!treatmentData.quantite_prescrite || treatmentData.quantite_prescrite <= 0) {
    throw new Error("La quantite prescrite doit etre superieure a 0");
  }
  const prescription = await addMedicalTreatmentModel(treatmentData, medecinId);
  await upsertSuiviTherapeutique({
    prescriptionId: prescription.id,
    patientId: prescription.patient_id,
    statutPatient: "en attente",
    dateProchainePrise: prescription.date_prochaine_prise,
    dateEcart: 0,
  });
  return prescription;
};

export const findMedicalTreatmentByNumeroDossier = async (numeroDossier) => {
  const patient = await getPatientByNumero(numeroDossier);
  if (!patient) {
    throw new Error(`Patient ${numeroDossier} non trouve`);
  }

  const prescriptions = await findByNumeroModel(numeroDossier);
  return {
    success: true,
    prescriptions,
    patient,
  };
};

export const getThreeLastPrise = async (numeroDossier) => {
  const patient = await getPatientByNumero(numeroDossier);
  if (!patient) throw new Error("Patient non trouve");

  const prises = await getThreeLastPriseModel(numeroDossier);
  return { success: true, prises };
};

export const getTreatmentStartDate = async (prescriptionId) => {
  const date = await getTreatmentStartDateModel(prescriptionId);
  if (!date) throw new Error("Prescription medicale non trouvee");
  return date;
};

export const getNextIntakeDate = async (prescriptionId) => {
  const date = await getNextIntakeDateModel(prescriptionId);
  if (date === undefined) throw new Error("Prescription medicale non trouvee");
  return date;
};

export const getPrescriptionById = async (id) => {
  const prescription = await getPrescriptionByIdModel(id);
  if (!prescription) throw new Error("Prescription medicale non trouvee");
  return prescription;
};

export const updatePrescription = async (id, data) => {
  const prescription = await getPrescriptionByIdModel(id);
  if (!prescription) throw new Error("Prescription medicale non trouvee");

  if (data.quantite_prescrite && data.quantite_prescrite <= 0) {
    throw new Error("La quantite doit etre superieure a 0");
  }

  return updatePrescriptionModel(id, data);
};

export const getPatientsPerduDeVue = async () => getPatientsPerduDeVueModel();

export const updateDateProchainePrise = async (prescriptionId, dateProchainePrise) => {
  const prescription = await getPrescriptionByIdModel(prescriptionId);
  if (!prescription) throw new Error("Prescription medicale non trouvee");
  return updateDateProchainePriseModel(prescriptionId, dateProchainePrise);
};

export const validerPrescription = async (prescriptionId) => {
  const prescription = await getPrescriptionByIdModel(prescriptionId);
  if (!prescription) throw new Error("Prescription medicale non trouvee");

  if ((prescription.statut_prescription || "").toLowerCase() === "delivree") {
    throw new Error("Cette prescription est deja delivree");
  }

  const dateValidation = new Date();
  const dateProchainePrise = SuiviTherapeutique.calculerDateProchainePrise(
    dateValidation,
    prescription.quantite_prescrite,
  );
  const suivi = new SuiviTherapeutique(dateProchainePrise, dateValidation);

  const updatedPrescription = await validerPrescriptionModel(prescriptionId, {
    dateProchainePrise: dateProchainePrise.toISOString().split("T")[0],
    statutPatient: suivi.statutPatient,
    ecartJours: suivi.ecartJours,
  });

  return {
    ...updatedPrescription,
    ...suivi.toJSON(),
  };
};

export const getStatistiques = async () => {
  const stats = await countPrescriptionsByStatut();
  const formatted = stats.reduce((acc, item) => {
    acc[item.statut] = Number.parseInt(item.count, 10);
    return acc;
  }, {});

  return {
    actif: formatted.actif || 0,
    "perdue de vue": formatted["perdue de vue"] || formatted["perdu de vue"] || 0,
    "en attente": formatted["en attente"] || 0,
    decede: formatted.decede || 0,
    "en cours de suivi": formatted.actif || 0,
    "perdu de vue": formatted["perdue de vue"] || formatted["perdu de vue"] || 0,
    "en fin de suivi": 0,
    total: stats.reduce((sum, item) => sum + Number.parseInt(item.count, 10), 0),
  };
};
