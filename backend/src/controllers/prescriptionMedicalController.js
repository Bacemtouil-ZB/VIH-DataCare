import {
  createPrescriptionExamen    as createPrescriptionExamenService,
  getPrescriptionsByNumeroDossier as getPrescriptionsByNumeroDossierService,
  getPrescriptionById         as getPrescriptionByIdService,
  updatePrescriptionExamen    as updatePrescriptionExamenService,
} from "../services/prescriptionMedicalService.js";
import { logAction } from "../services/auditService.js";

// ── CREATE ────────────────────────────────────────────────────────────────────
export const createPrescriptionExamenController = async (req, res) => {
  try {
    const prescription = await createPrescriptionExamenService(req.body, req.user.id);

    await logAction(req, {
      module:     "PRESCRIPTION_MEDICALE",
      action:     "PRESCRIPTION_MEDICALE_CREATE",
      patient_id: prescription.patient_id,
      entity_id:  prescription.id,
      old_data:   null,
      new_data:   prescription,
    });

    res.status(201).json({
      success:      true,
      message:      "Prescription créée avec succès",
      prescription,
    });
  } catch (error) {
    console.error("Erreur createPrescriptionExamen:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── GET BY NUMERO DOSSIER ─────────────────────────────────────────────────────
export const getPrescriptionsByNumeroDossierController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
    const prescriptions = await getPrescriptionsByNumeroDossierService(numeroDossier);

    await logAction(req, {
      module:     "PRESCRIPTION_MEDICALE",
      action:     "PRESCRIPTION_MEDICALE_VIEW",
      patient_id: null,
      entity_id:  null,
      old_data:   null,
      new_data:   null,
    });

    res.status(200).json({ success: true, prescriptions });
  } catch (error) {
    console.error("Erreur getPrescriptionsByNumeroDossier:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── UPDATE ────────────────────────────────────────────────────────────────────
export const updatePrescriptionExamenController = async (req, res) => {
  try {
    const { id } = req.params;

    // Charger l'ancien état AVANT la mise à jour
    const oldPrescription = await getPrescriptionByIdService(parseInt(id));
    const prescription    = await updatePrescriptionExamenService(parseInt(id), req.body);

    await logAction(req, {
      module:     "PRESCRIPTION_MEDICALE",
      action:     "PRESCRIPTION_MEDICALE_UPDATE",
      patient_id: prescription.patient_id,
      entity_id:  prescription.id,
      old_data:   oldPrescription,
      new_data:   prescription,
    });

    res.status(200).json({
      success:      true,
      message:      "Prescription mise à jour avec succès",
      prescription,
    });
  } catch (error) {
    console.error("Erreur updatePrescriptionExamen:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
