import {
  createHabitudeDeVie as createHabitudeDeVieModel,
  getHabitudeDeVieById as getHabitudeDeVieByIdModel,
  getHabitudeDeVieByNumeroDossier as getHabitudeDeVieByNumeroDossierModel,
  updateHabitudeDeVie as updateHabitudeDeVieModel,
} from "../../models/examenClinique/habitudeDeVieModel.js";


export const createHabitudeDeVie = async (habitudeData, userId) => {
  const habitude = await createHabitudeDeVieModel(habitudeData, userId);
  return habitude;
};

/**
 * Récupérer par ID
 */
export const getHabitudeDeVieById = async (id) => {
  const habitude = await getHabitudeDeVieByIdModel(id);
  if (!habitude) {
    throw new Error("Habitudes de vie non trouvées");
  }
  return habitude;
};

/**
 * Récupérer par numéro de dossier
 */
export const getHabitudeDeVieByNumeroDossier = async (numero) => {
  const habitudes = await getHabitudeDeVieByNumeroDossierModel(numero);
  return habitudes; // Retourne un tableau (peut être vide)
};

/**
 * Mettre à jour
 */
export const updateHabitudeDeVie = async (id, habitudeData, userId) => {
  const updatedHabitude = await updateHabitudeDeVieModel(id, habitudeData, userId);
  return updatedHabitude;
};