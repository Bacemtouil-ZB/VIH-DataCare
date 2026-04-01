import {
  createResultat            as createResultatService,
  getResultatsByNumeroDossier as getResultatsByNumeroDossierService,
  getDernierBilanPrescrit   as getDernierBilanPrescritService,
  getResultatById           as getResultatByIdService,
  updateResultat            as updateResultatService,
} from "../services/resultatBiologiqueService.js";
import { logAction } from "../services/auditService.js";

// ── CREATE ────────────────────────────────────────────────────────────────────
export const createResultatController = async (req, res) => {
  try {
    const resultat = await createResultatService(req.body);
    await logAction(req, {
      module: "RESULTAT_BIOLOGIQUE", action: "RESULTAT_BIOLOGIQUE_CREATE",
      patient_id: resultat.patient_id, entity_id: resultat.id,
      old_data: null, new_data: resultat,
    });
    res.status(201).json({ success: true, message: "Résultat enregistré", resultat });
  } catch (error) {
    console.error("Erreur createResultat:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── GET BY NUMERO DOSSIER ─────────────────────────────────────────────────────
export const getResultatsByNumeroDossierController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
    const resultats = await getResultatsByNumeroDossierService(numeroDossier);
    await logAction(req, {
      module: "RESULTAT_BIOLOGIQUE", action: "RESULTAT_BIOLOGIQUE_VIEW",
      patient_id: null, entity_id: null, old_data: null, new_data: null,
    });
    res.status(200).json({ success: true, resultats });
  } catch (error) {
    console.error("Erreur getResultats:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── GET DERNIER BILAN PRESCRIT ────────────────────────────────────────────────
export const getDernierBilanPrescritController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
    const bilan = await getDernierBilanPrescritService(numeroDossier);
    res.status(200).json({ success: true, bilan });
  } catch (error) {
    console.error("Erreur getDernierBilan:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── UPDATE ────────────────────────────────────────────────────────────────────
export const updateResultatController = async (req, res) => {
  try {
    const { id } = req.params;
    const oldResultat = await getResultatByIdService(parseInt(id));
    const resultat    = await updateResultatService(parseInt(id), req.body);
    await logAction(req, {
      module: "RESULTAT_BIOLOGIQUE", action: "RESULTAT_BIOLOGIQUE_UPDATE",
      patient_id: resultat.patient_id, entity_id: resultat.id,
      old_data: oldResultat, new_data: resultat,
    });
    res.status(200).json({ success: true, message: "Résultat mis à jour", resultat });
  } catch (error) {
    console.error("Erreur updateResultat:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
