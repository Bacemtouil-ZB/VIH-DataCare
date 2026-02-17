import {
  addMedicalTreatment as addMedicalTreatmentModel,
  findMedicalTreatmentByNumeroDossier as findByNumeroModel,
  getThreeLastPrise as getThreeLastPriseModel,
  getTreatmentStartDate as getTreatmentStartDateModel,
  getNextIntakeDate as getNextIntakeDateModel,
  getOrdonnanceById as getOrdonnanceByIdModel,
  updateOrdonnance as updateOrdonnanceModel,
  getPatientsPerduDeVue as getPatientsPerduDeVueModel,
  updateDateProchainePrise as updateDateProchainePriseModel,
  countOrdonnancesByStatut,
} from "../models/ordonnanceModel.js";

import { getPatientById, getPatientByNumero } from "../models/patientModel.js";

export const addMedicalTreatment = async (treatmentData, medecinId) => {
  // Validation quantité
  if (!treatmentData.quantite_prescrite || treatmentData.quantite_prescrite <= 0) {
    throw new Error("La quantité prescrite doit être supérieure à 0");
  }

  // Validation dates
  if (!treatmentData.date_debut_traitement) {
    throw new Error("La date de début de traitement est requise");
  }

  const ordonnance = await addMedicalTreatmentModel(treatmentData, medecinId);
  return ordonnance;
};

export const findMedicalTreatmentByNumeroDossier = async (numeroDossier) => {
  const patient = await getPatientByNumero(numeroDossier);
  if (!patient) {
    throw new Error(`Patient ${numeroDossier} non trouvé`);
  }

  const ordonnances = await findByNumeroModel(numeroDossier);
    return {
    success: true,
    ordonnances: ordonnances,
    patient: patient,
  };
};

export const getThreeLastPrise = async (numeroDossier) => {
  const patient = await getPatientByNumero(numeroDossier);
  if (!patient) {
    throw new Error("Patient non trouvé");
  }
  const prises = await getThreeLastPriseModel(numeroDossier);
  return {
    success: true,
    prises: prises,
  };
};

export const getTreatmentStartDate = async (ordonnanceId) => {
  const date = await getTreatmentStartDateModel(ordonnanceId);
  
  if (!date) {
    throw new Error("Ordonnance non trouvée");
  }

  return date;
};

// ==========================================

export const getNextIntakeDate = async (ordonnanceId) => {
  const date = await getNextIntakeDateModel(ordonnanceId);
  
  if (date === undefined) {
    throw new Error("Ordonnance non trouvée");
  }

  return date; // Peut être null si pas de prochaine prise
};

export const getOrdonnanceById = async (id) => {
  const ordonnance = await getOrdonnanceByIdModel(id);
  
  if (!ordonnance) {
    throw new Error("Ordonnance non trouvée");
  }

  return ordonnance;
};

export const updateOrdonnance = async (id, data) => {
  const ordonnance = await getOrdonnanceByIdModel(id);
  
  if (!ordonnance) {
    throw new Error("Ordonnance non trouvée");
  }

  // Validation quantité si fournie
  if (data.quantite_prescrite && data.quantite_prescrite <= 0) {
    throw new Error("La quantité doit être supérieure à 0");
  }

  return await updateOrdonnanceModel(id, data);
};
export const getPatientsPerduDeVue = async () => {
  return await getPatientsPerduDeVueModel();
};

export const updateDateProchainePrise = async (ordonnanceId, dateProchainePrise) => {
  const ordonnance = await getOrdonnanceByIdModel(ordonnanceId);
  
  if (!ordonnance) {
    throw new Error("Ordonnance non trouvée");
  }

  return await updateDateProchainePriseModel(ordonnanceId, dateProchainePrise);
};
//analyste
export const getStatistiques = async () => {
  const stats = await countOrdonnancesByStatut();
  
  const formatted = stats.reduce((acc, item) => {
    acc[item.statut] = parseInt(item.count);
    return acc;
  }, {});

  return {
    'en cours de suivi': formatted['en cours de suivi'] || 0,
    'perdu de vue': formatted['perdu de vue'] || 0,
    'en fin de suivi': formatted['en fin de suivi'] || 0,
    'decedé': formatted['decedé'] || 0,
    total: stats.reduce((sum, item) => sum + parseInt(item.count), 0),
  };
};