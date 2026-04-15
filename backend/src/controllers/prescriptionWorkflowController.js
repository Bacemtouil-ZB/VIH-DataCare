import {
  getPrescriptions,
  addPrescription,
  valider,
  validerAvecModification,
  supprimerPrescriptionsExpirees,
  getLastPrescriptionPerPatient,
} from "../services/prescriptionWorkflowServices.js";
import { logAction } from "../services/auditService.js";
import { findById } from "../models/prescriptionWorkflowModel.js";

export const getController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
    await supprimerPrescriptionsExpirees();
    const { prescriptions, patient } = await getPrescriptions(numeroDossier);
    res.status(200).json({
      success: true,
      count: prescriptions.length,
      prescriptions,
      patient,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addController = async (req, res) => {
  try {
    const prescription = await addPrescription(req.body, req.user.id);

    await logAction(req, {
      module: "PRESCRIPTION",
      action: "PRESCRIPTION_CREATE",
      patient_id: prescription.patient_id,
      entity_id: prescription.id,
      old_data: null,
      new_data: prescription,
    });

    res.status(201).json({
      success: true,
      message: "Prescription ajoutee avec succes",
      prescription,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const validerController = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);

    // Récupérer old_data AVANT validation
    const old_data = await findById(id);
    const prescription = await valider(id);

    await logAction(req, {
      module: "PRESCRIPTION",
      action: "PRESCRIPTION_VALIDER",
      patient_id: prescription.patient_id,
      entity_id: prescription.id,
      old_data: old_data,
      new_data: prescription,
    });

    res.status(200).json({
      success: true,
      message: "Prescription delivree avec succes",
      prescription,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const validerAvecModificationController = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    const { periode_modifiee } = req.body;

    if (!periode_modifiee) {
      return res.status(400).json({
        success: false,
        message: "La periode modifiee est requise",
      });
    }

    // Récupérer old_data AVANT modification
    const old_data = await findById(id);
    const prescription = await validerAvecModification(id, periode_modifiee);

    await logAction(req, {
      module: "PRESCRIPTION",
      action: "PRESCRIPTION_VALIDER_MODIFIEE",
      patient_id: prescription.patient_id,
      entity_id: prescription.id,
      old_data: old_data,
      new_data: prescription,
    });

    res.status(200).json({
      success: true,
      message: "Prescription validee avec periode modifiee",
      prescription,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getLastPerPatientController = async (req, res) => {
  try {
    const data = await getLastPrescriptionPerPatient();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteExpiredController = async (req, res) => {
  try {
    const supprimees = await supprimerPrescriptionsExpirees();
    res.status(200).json({
      success: true,
      message: `${supprimees.length} prescription(s) expirée(s) supprimée(s)`,
      supprimees,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};