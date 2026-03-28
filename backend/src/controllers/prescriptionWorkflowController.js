import {
  getPrescriptions,
  addPrescription,
  valider,
  updateQuantiteDelivree,
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

export const updateQuantiteDelivreeController = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantite_delivree } = req.body;
    
    if (quantite_delivree === undefined) {
      return res.status(400).json({ success: false, message: "Quantité requise" });
    }
    
    const prescription = await updateQuantiteDelivree(id, quantite_delivree);
    res.status(200).json({ success: true, message: "Mise à jour réussie", prescription });
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
 