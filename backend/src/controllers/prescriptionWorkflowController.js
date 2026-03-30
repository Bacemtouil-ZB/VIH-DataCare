import {
  getPrescriptions,
  addPrescription,
  valider,
  getLastPrescriptionPerPatient
} from "../services/prescriptionWorkflowServices.js";

// ── GET /numero-dossier/:numeroDossier ────────────────────────
export const getController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
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

// ── PATCH /:id/valider ────────────────────────────────────────
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


export const getLastPerPatientController = async (req, res) => {
  try {
    const data = await getLastPrescriptionPerPatient();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
 