import {
  createSocial as createSocialModel,
  getSocialById as getSocialByIdModel,
  getSocialByPatientId as getSocialByPatientIdModel,
  checkSocialExists,
  updateSocial as updateSocialModel,
} from "../models/socialModel.js";

import { getPatientById } from "../models/patientModel.js";

export const createSocial = async (socialData, userId) => {
  const { patient_id } = socialData;

  // Vérifier que le patient existe
  const patient = await getPatientById(patient_id);
  if (!patient) {
    throw new Error("Patient non trouvé");
  }
  // Vérifier qu'une fiche sociale n'existe pas déjà pour ce patient
  const exists = await checkSocialExists(patient_id);
  if (exists) {
    throw new Error(`Une fiche sociale existe déjà pour le patient ${patient.numero}`);
  }

  const social = await createSocialModel(socialData, userId);
  return social;
};

export const getSocialById = async (id) => {
  const social = await getSocialByIdModel(id);
  
  if (!social) {
    throw new Error("Fiche sociale non trouvée");
  }
  return social;
};


export const getSocialByPatientId = async (patientId) => {
  // Vérifier que le patient existe
  const patient = await getPatientById(patientId);
  if (!patient) {
    throw new Error("Patient non trouvé");
  }
  const social = await getSocialByPatientIdModel(patientId);
  
  if (!social) {
    throw new Error(`Aucune fiche sociale trouvée pour le patient ${patient.numero}`);
  }
  return social;
};

export const checkSocialExistsForPatient = async (patientId) => {
  const exists = await checkSocialExists(patientId);
  
  if (exists) {
    const social = await getSocialByPatientIdModel(patientId);
    return { exists: true, social };
  }
  
  return { exists: false, social: null };
};

export const updateSocial = async (id, socialData, userId) => {
  // Vérifier que la fiche sociale existe
  const social = await getSocialByIdModel(id);
  if (!social) {
    throw new Error("Fiche sociale non trouvée");
  }

  const updatedSocial = await updateSocialModel(id, socialData, userId);
  return updatedSocial;
};

