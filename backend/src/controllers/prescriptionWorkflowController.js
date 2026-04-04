// =====================================================
// CONTROLLER - prescriptionWorkflowController.js
// =====================================================

import {
  getPrescriptions,
  addPrescription,
  valider,
  validerAvecModification,
  supprimerPrescriptionsExpirees,
  getLastPrescriptionPerPatient,
} from "../services/prescriptionWorkflowServices.js";

// ── GET /numero-dossier/:numeroDossier ────────────────────────
export const getController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
    
    // Supprime les prescriptions expirées avant de retourner les données
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

// ── POST /add ─────────────────────────────────────────────────
export const addController = async (req, res) => {
  try {
    const prescription = await addPrescription(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: "Prescription ajoutee avec succes",
      prescription,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── PATCH /:id/valider — Scénario 1 : Validation sans modification ────
export const validerController = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    const prescription = await valider(id);
    res.status(200).json({
      success: true,
      message: "Prescription delivree avec succes",
      prescription,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── PATCH /:id/valider-modifiee — Scénario 2 : Validation avec modification ────
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

    const prescription = await validerAvecModification(id, periode_modifiee);
    
    res.status(200).json({
      success: true,
      message: "Prescription validee avec periode modifiee",
      prescription,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── GET /last-per-patient ─────────────────────────────────────
export const getLastPerPatientController = async (req, res) => {
  try {
    const data = await getLastPrescriptionPerPatient();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── POST /supprimer-expirees — Endpoint manuel (optionnel) ────
export const supprimerExpireesController = async (req, res) => {
  try {
    const deleted = await supprimerPrescriptionsExpirees();
    res.status(200).json({
      success: true,
      message: `${deleted.length} prescription(s) expiree(s) supprimee(s)`,
      deleted,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};