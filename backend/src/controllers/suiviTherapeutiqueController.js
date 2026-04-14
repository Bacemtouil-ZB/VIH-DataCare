import {
  getSuiviByPatient,
  getSuiviByNumero,
  syncSuiviStatuts,
} from "../services/suiviTherapeutiqueService.js";

// ── GET suivi par patientId ───────────────────────────────────
export const getSuiviByPatientController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const suivis = await getSuiviByPatient(parseInt(patientId, 10));
    res.status(200).json({
      success: true,
      count:   suivis.length,
      suivis,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── GET suivi par numéro de dossier ───────────────────────────
export const getSuiviByNumeroController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
    const suivis = await getSuiviByNumero(numeroDossier);
    res.status(200).json({
      success: true,
      count:   suivis.length,
      suivis,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── POST /sync — synchronisation statuts (cron ou appel manuel) ──
export const syncStatutsController = async (req, res) => {
  try {
    const updated = await syncSuiviStatuts();
    res.status(200).json({
      success: true,
      message: `${updated.length} ligne(s) mise(s) à jour`,
      updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};