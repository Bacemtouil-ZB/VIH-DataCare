import {
  createExamenClinique as createExamenCliniqueModel,
  getExamenCliniqueById as getExamenCliniqueByIdModel,
  getExamensByNumeroDossier as getExamensByNumeroDossierModel,
  updateExamenClinique as updateExamenCliniqueModel,

} from "../models/examenCliniqueModel.js";

export const createExamenClinique = async (examenData, medecinId) => {

  const examen = await createExamenCliniqueModel(examenData, medecinId);
  return examen;
};

export const getExamenCliniqueById = async (id) => {
  const examen = await getExamenCliniqueByIdModel(id);
  if (!examen) {
    throw new Error("Examen clinique non trouvé");
  }
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
