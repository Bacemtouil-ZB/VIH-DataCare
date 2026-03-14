import {
  createVih as createVihModel,
  getVihById as getVihByIdModel,
  getVihByNumeroDossier as getVihByNumeroDossierModel,
  updateVih as updateVihModel,
} from "../models/vihModel.js";

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

export const getVihByNumeroDossier = async (numero) => {
  const vih = await getVihByNumeroDossierModel(numero);
  if (!vih) {
    throw new Error("Aucun dossier VIH trouvé pour ce patient");
  }
  return vih;
};

export const updateVih = async (id, vihData, userId) => {
  const updatedVih = await updateVihModel(id, vihData, userId);
  return updatedVih;
};
