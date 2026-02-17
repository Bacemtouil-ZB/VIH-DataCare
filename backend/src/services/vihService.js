import {
  createVih as createVihModel,
  getVihById as getVihByIdModel,
  getVihByPatientId as getVihByPatientIdModel,
  updateVih as updateVihModel,
  getVihHistoryByPatientId,


} from "../models/vihModel.js";
import { getPatientById } from "../models/patientModel.js";

export const createVih = async (vihData, userId) => {
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
export const getVihHistory = async (patientId) => {
  const history = await getVihHistoryByPatientId(patientId);
  return history;
};

