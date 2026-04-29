//cheked 15/04/2026
import {
  createObservation,
  getObservationsByNumeroDossier,
  updateObservation,
} from "../../services/examenClinique/observationService.js";
import { logAction } from "../../services/auditService.js";

export const createObservationController = async (req, res) => {
  try {
    const observation = await createObservation(req.body);

    await logAction(req, {
      module: "OBSERVATION",
      action: "OBSERVATION_CREATE",
      patient_id: observation.patient_id,
      entity_id: observation.id,
      old_data: null,
      new_data: observation,
    });

    res.status(201).json({ success: true, observation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getObservationsByNumeroDossierController = async (req, res) => {
  try {
    const observations = await getObservationsByNumeroDossier(req.params.numeroDossier);
    const firstObservation = Array.isArray(observations) && observations.length > 0 ? observations[0] : null;

    await logAction(req, {
      module: "OBSERVATION",
      action: "OBSERVATION_VIEW",
      patient_id: firstObservation?.patient_id ?? null,
      entity_id: firstObservation?.id ?? null,
      old_data: null,
      new_data: null,
    });

    res.status(200).json({ success: true, observations });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateObservationController = async (req, res) => {
  try {
    const observation = await updateObservation(req.params.id, req.body);

    await logAction(req, {
      module: "OBSERVATION",
      action: "OBSERVATION_UPDATE",
      patient_id: observation.patient_id,
      entity_id: observation.id,
      old_data: null,
      new_data: observation,
    });

    res.status(200).json({ success: true, observation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
