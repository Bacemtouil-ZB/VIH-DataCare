import {
  createExamenClinique as createExamenModel,
  getExamenCliniqueById as getExamenByIdModel,
  getExamensByPatientId as getExamensByPatientModel,
  updateExamenClinique as updateExamenModel,

} from "../models/examenCliniqueModel.js";
import { getPatientById } from "../models/patientModel.js";


export const createExamenClinique = async (examenData, userId) => {
  const { patient_id } = examenData;
  const patient = await getPatientById(patient_id);
  if (!patient) {
    throw new Error("Patient non trouvé");
  }

  const examen = await createExamenModel(examenData);
  return examen;
};

export const getExamenCliniqueById = async (id) => {
  const examen = await getExamenByIdModel(id);
  if (!examen) {
    throw new Error("Examen clinique non trouvé");
  }
  return examen;
};

export const getExamensByPatientId = async (patientId) => {
  const patient = await getPatientById(patientId);
  if (!patient) {
    throw new Error("Patient non trouvé");
  }

  const examens = await getExamensByPatientModel(patientId);
  return examens;
};

export const updateExamenClinique = async (id, examenData, userId) => {
  const examen = await getExamenByIdModel(id);
  if (!examen) {
    throw new Error("Examen clinique non trouvé");
  }

  const updatedExamen = await updateExamenModel(id, examenData);
  return updatedExamen;
};
