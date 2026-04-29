import {
  getSuiviByPatient,
  getSuiviByNumero,
  syncSuiviStatuts,
} from "../services/suiviTherapeutiqueService.js";
import { logAction } from "../services/auditService.js";

export const getSuiviByPatientController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const suivis = await getSuiviByPatient(parseInt(patientId, 10));

    await logAction(req, {
      module: "SUIVI_THERAPEUTIQUE",
      action: "SUIVI_THERAPEUTIQUE_VIEW_BY_PATIENT",
      patient_id: Number(patientId),
      entity_id: null,
      old_data: null,
      new_data: null,
    });

    res.status(200).json({
      success: true,
      count: suivis.length,
      suivis,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getSuiviByNumeroController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
    const suivis = await getSuiviByNumero(numeroDossier);

    await logAction(req, {
      module: "SUIVI_THERAPEUTIQUE",
      action: "SUIVI_THERAPEUTIQUE_VIEW_BY_NUMERO",
      entity_id: null,
      old_data: null,
      new_data: { numeroDossier },
    });

    res.status(200).json({
      success: true,
      count: suivis.length,
      suivis,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const syncStatutsController = async (req, res) => {
  try {
    const updated = await syncSuiviStatuts();

    await logAction(req, {
      module: "SUIVI_THERAPEUTIQUE",
      action: "SUIVI_THERAPEUTIQUE_SYNC",
      entity_id: null,
      old_data: null,
      new_data: { updatedCount: updated.length },
    });

    res.status(200).json({
      success: true,
      message: `${updated.length} ligne(s) mise(s) Ã  jour`,
      updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
