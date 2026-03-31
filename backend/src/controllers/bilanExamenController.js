import {
  createBilanExamen      as createBilanExamenService,
  getBilansByNumeroDossier as getBilansByNumeroDossierService,
  getBilanById           as getBilanByIdService,
  updateBilanExamen      as updateBilanExamenService,
  getPatientIdByNumero,
} from "../services/bilanExamenService.js";
import { logAction } from "../services/auditService.js";

// ── CREATE ────────────────────────────────────────────────────────────────────
export const createBilanExamenController = async (req, res) => {
  try {
    const bilan = await createBilanExamenService(req.body);

    await logAction(req, {
      module:     "BILAN_EXAMEN",
      action:     "BILAN_EXAMEN_CREATE",
      patient_id: bilan.patient_id,
      entity_id:  bilan.id,
      old_data:   null,
      new_data:   bilan,
    });

    res.status(201).json({
      success: true,
      message: "Bilan créé avec succès",
      bilan,
    });
  } catch (error) {
    console.error("Erreur createBilanExamen:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── GET BY NUMERO DOSSIER ─────────────────────────────────────────────────────
export const getBilansByNumeroDossierController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
    const bilans = await getBilansByNumeroDossierService(numeroDossier);

    const patient_id = await getPatientIdByNumero(numeroDossier);
    
    await logAction(req, {
      module:     "BILAN_EXAMEN",
      action:     "BILAN_EXAMEN_VIEW",
      patient_id: patient_id || null,
      entity_id:  null,
      old_data:   null,
      new_data:   null,
    });

    res.status(200).json({ success: true, bilans });
  } catch (error) {
    console.error("Erreur getBilansByNumeroDossier:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── UPDATE ────────────────────────────────────────────────────────────────────
export const updateBilanExamenController = async (req, res) => {
  try {
    const { id } = req.params;
    const oldBilan = await getBilanByIdService(parseInt(id));
    const bilan    = await updateBilanExamenService(parseInt(id), req.body);

    await logAction(req, {
      module:     "BILAN_EXAMEN",
      action:     "BILAN_EXAMEN_UPDATE",
      patient_id: bilan.patient_id,
      entity_id:  bilan.id,
      old_data:   oldBilan,
      new_data:   bilan,
    });

    res.status(200).json({
      success: true,
      message: "Bilan mis à jour avec succès",
      bilan,
    });
  } catch (error) {
    console.error("Erreur updateBilanExamen:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};