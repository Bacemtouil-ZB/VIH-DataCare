import {
  createVih as createVihModel,
  getVihById as getVihByIdModel,
  getVihByPatientId as getVihByPatientIdModel,
  updateVih as updateVihModel,
  deleteVih as deleteVihModel,
  checkVihExistsForPatient,
} from "../models/vihModel.js";
import { getPatientById } from "../models/patientModel.js";

export const createVih = async (vihData, userId) => {
  const { patient_id } = vihData;

  // Vérifier que le patient existe
  const patient = await getPatientById(patient_id);
  if (!patient) {
    throw new Error("Patient non trouvé");
  }

  // Vérifier qu'il n'existe pas déjà un dossier VIH pour ce patient
  const exists = await checkVihExistsForPatient(patient_id);
  if (exists) {
    throw new Error("Un dossier VIH existe déjà pour ce patient");
  }

  // Créer le dossier VIH
  const vih = await createVihModel(vihData, userId);
  return vih;
};

export const getVihById = async (id) => {
  const vih = await getVihByIdModel(id);
  if (!vih) {
    throw new Error("Dossier VIH non trouvé");
  }

  return vih;
};

export const getVihByPatientId = async (patientId) => {
  const patient = await getPatientById(patientId);
  if (!patient) {
    throw new Error("Patient non trouvé");
  }
  const vih = await getVihByPatientIdModel(patientId);
  if (!vih) {
    throw new Error("Aucun dossier VIH trouvé pour ce patient");
  }

  return vih;
};

export const updateVih = async (id, vihData, userId) => {
  // Vérifier que le dossier VIH existe
  const vih = await getVihByIdModel(id);
  if (!vih) {
    throw new Error("Dossier VIH non trouvé");
  }
  const updatedVih = await updateVihModel(id, vihData, userId);
  return updatedVih;
};

export const deleteVih = async (id) => {
  // Vérifier que le dossier VIH existe
  const vih = await getVihByIdModel(id);
  if (!vih) {
    throw new Error("Dossier VIH non trouvé");
  }
  
  const deleted = await deleteVihModel(id);
  return deleted;
};