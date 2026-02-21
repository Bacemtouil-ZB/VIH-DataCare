import {
  createHabitudeDeVie    as createModel,
  getHabitudeDeVieById   as getByIdModel,
  getHabitudeDeVieByNumeroDossier as getByNumeroModel,
  updateHabitudeDeVie    as updateModel,
} from "../models/habitudeDeVieModel.js";

export const createHabitudeDeVie = async (data) => {
  return await createModel(data);
};

export const getHabitudeDeVieById = async (id) => {
  const habitude = await getByIdModel(id);
  if (!habitude) throw new Error("Habitude de vie non trouvée");
  return habitude;
};

export const getHabitudeDeVieByNumeroDossier = async (numeroDossier) => {
  if (!numeroDossier) throw new Error("Numéro de dossier requis");
  return await getByNumeroModel(numeroDossier);
};

export const updateHabitudeDeVie = async (id, data) => {
  const existing = await getByIdModel(id);
  if (!existing) throw new Error("Habitude de vie non trouvée");
  return await updateModel(id, data);
};