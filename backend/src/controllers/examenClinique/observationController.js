import {
  createObservation,
  getObservationsByNumeroDossier,
  updateObservation,
} from "../../services/examenClinique/observationService.js";

export const createObservationController = async (req, res) => {
  try {
    const observation = await createObservation(req.body);
    res.status(201).json({ success: true, observation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getObservationsByNumeroDossierController = async (req, res) => {
  try {
    const observations = await getObservationsByNumeroDossier(req.params.numeroDossier);
    res.status(200).json({ success: true, observations });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateObservationController = async (req, res) => {
  try {
    const observation = await updateObservation(req.params.id, req.body);
    res.status(200).json({ success: true, observation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};