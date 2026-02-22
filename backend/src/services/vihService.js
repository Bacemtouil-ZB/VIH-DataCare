import {
  createVih as createVihModel,
  getVihById as getVihByIdModel,
<<<<<<< HEAD
  getVihByPatientId as getVihByPatientIdModel,
  updateVih as updateVihModel,


} from "../models/vihModel.js";
import { getPatientById } from "../models/patientModel.js";
=======
  getVihByNumeroDossier as getVihByNumeroDossierModel,
  updateVih as updateVihModel,
} from "../models/vihModel.js";
>>>>>>> origin/feature/vih

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

<<<<<<< HEAD
export const getVihByPatientId = async (patientId) => {
  const patient = await getPatientById(patientId);
  if (!patient) {
    throw new Error("Patient non trouvé");
  }
  const vih = await getVihByPatientIdModel(patientId);
  if (!vih) {
    throw new Error("Aucun dossier VIH trouvé pour ce patient");
  }

=======
export const getVihByNumeroDossier = async (numero) => {
  const vih = await getVihByNumeroDossierModel(numero);
  if (!vih) {
    throw new Error("Aucun dossier VIH trouvé pour ce patient");
  }
>>>>>>> origin/feature/vih
  return vih;
};

export const updateVih = async (id, vihData, userId) => {
<<<<<<< HEAD
  // Vérifier que le dossier VIH existe
  const vih = await getVihByIdModel(id);
  if (!vih) {
    throw new Error("Dossier VIH non trouvé");
  }
  const updatedVih = await updateVihModel(id, vihData, userId);
  return updatedVih;
};
=======
  const updatedVih = await updateVihModel(id, vihData, userId);
  return updatedVih;
};

>>>>>>> origin/feature/vih
