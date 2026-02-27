import {
  createObservation as createObservationModel,
  getObservationsByNumeroDossier as getObservationsByNumeroModel,
  updateObservation as updateObservationModel,
} from "../models/observationModel.js";

export const createObservation = async (data) => {
  const { examen_clinique_id, remarque } = data;
  return createObservationModel(examen_clinique_id, remarque);
};

export const getObservationsByNumeroDossier = async (numeroDossier) => {
  return getObservationsByNumeroModel(numeroDossier);
};

export const updateObservation = async (id, data) => {
  return updateObservationModel(id, data.remarque);
};