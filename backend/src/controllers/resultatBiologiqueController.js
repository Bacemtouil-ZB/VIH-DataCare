import {
  createResultat,
  getResultatsByNumeroDossier,
  getDernierBilanPrescrit,
  getResultatById,
  updateResultat,
} from "../services/resultatBiologiqueService.js";
import { logAction } from "../services/auditService.js";

export const createResultatController = async (req, res) => {
  try {
    const resultat = await createResultat(req.body);

    await logAction(req, {
      module: "RESULTAT_BIOLOGIQUE",
      action: "RESULTAT_BIOLOGIQUE_CREATE",
      patient_id: resultat.patient_id,
      entity_id: resultat.id,
      old_data: null,
      new_data: resultat,
    });

    return res.status(201).json({
      success: true,
      message: "Resultat enregistre",
      resultat,
    });
  } catch (error) {
    console.error("Erreur createResultat:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getResultatsByNumeroDossierController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
    const resultats = await getResultatsByNumeroDossier(numeroDossier);

    await logAction(req, {
      module: "RESULTAT_BIOLOGIQUE",
      action: "RESULTAT_BIOLOGIQUE_VIEW",
      patient_id: null,
      entity_id: null,
      old_data: null,
      new_data: null,
    });

    return res.status(200).json({ success: true, resultats });
  } catch (error) {
    console.error("Erreur getResultatsByNumeroDossier:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getDernierBilanPrescritController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
    const bilan = await getDernierBilanPrescrit(numeroDossier);

    return res.status(200).json({ success: true, bilan });
  } catch (error) {
    console.error("Erreur getDernierBilanPrescrit:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateResultatController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const oldResultat = await getResultatById(id);
    const resultat = await updateResultat(id, req.body);

    await logAction(req, {
      module: "RESULTAT_BIOLOGIQUE",
      action: "RESULTAT_BIOLOGIQUE_UPDATE",
      patient_id: resultat.patient_id,
      entity_id: resultat.id,
      old_data: oldResultat,
      new_data: resultat,
    });

    return res.status(200).json({
      success: true,
      message: "Resultat mis a jour",
      resultat,
    });
  } catch (error) {
    console.error("Erreur updateResultat:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};
