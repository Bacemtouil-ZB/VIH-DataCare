import {
  createExamenClinique as createExamenCliniqueModel,
  getExamensByNumeroDossier as getExamensByNumeroDossierModel,
  updateExamenClinique as updateExamenCliniqueModel,

} from "../models/examenCliniqueModel.js";

export const createExamenClinique = async (examenData, medecinId) => {

  const examen = await createExamenCliniqueModel(examenData, medecinId);
  return examen;
};

export const getExamensByNumeroDossier = async (numero) => {
  const examens = await getExamensByNumeroDossierModel(numero);
  return examens;
};

export const updateExamenClinique = async (id, examenData) => {

  const updatedExamen = await updateExamenCliniqueModel(id, examenData);
  return updatedExamen;
};
