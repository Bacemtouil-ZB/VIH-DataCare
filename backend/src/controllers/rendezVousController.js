import {
  createRendezvous as createRendezvousService,
  getRendezvousByNumeroDossier as getRendezvousByNumeroDossierService,
  getRendezvousById as getRendezvousByIdService,
  updateRendezvous as updateRendezvousService,
} from "../services/rendezVousService.js";
import { logAction } from "../services/auditService.js";

export const createRendezvousController = async (req, res) => {
  try {
    const rdv = await createRendezvousService(req.body);

   await logAction(req, {
      module: "RENDEZ_VOUS",
      action: "RENDEZ_VOUS_CREATE",
      patient_id: rdv.patient_id,
      entity_id: rdv.id,
      old_data: null,
      new_data: rdv,
    });

    res.status(201).json({
      success: true,
      message: "Rendez-vous créé avec succès",
      rendezvous: rdv,
    });
  } catch (error) {
    console.error("Erreur createRendezvous:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getRendezvousByNumeroDossierController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
    const rendezvous = await getRendezvousByNumeroDossierService(numeroDossier);

    await logAction(req, {
      module: "RENDEZ_VOUS",
      action: "RENDEZ_VOUS_VIEW",
      patient_id: null,
      entity_id: null,
      old_data: null,
      new_data: null,
    });

    res.status(200).json({ success: true, rendezvous });
  } catch (error) {
    console.error("Erreur getRendezvousByNumeroDossier:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getRendezvousByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const rdv = await getRendezvousByIdService(parseInt(id));

    await logAction(req, {
      module: "RENDEZ_VOUS",
      action: "RENDEZ_VOUS_VIEW",
      patient_id: rdv.patient_id,
      entity_id: rdv.id,
      old_data: null,
      new_data: null,
    });


    res.status(200).json({ success: true, rendezvous: rdv });
  } catch (error) {
    console.error("Erreur getRendezvousById:", error.message);
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateRendezvousController = async (req, res) => {
  try {
    const { id } = req.params;
    const oldrdv = await getRendezvousByIdService(parseInt(id));
    const rdv = await updateRendezvousService(parseInt(id), req.body);

    await logAction(req, {
      module: "RENDEZ_VOUS",
      action: "RENDEZ_VOUS_UPDATE",
      patient_id: rdv.patient_id,
      entity_id: rdv.id,
      old_data: oldrdv,
      new_data: rdv,
    });

    res.status(200).json({
      success: true,
      message: "Rendez-vous mis à jour avec succès",
      rendezvous: rdv,
    });
  } catch (error) {
    console.error("Erreur updateRendezvous:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};