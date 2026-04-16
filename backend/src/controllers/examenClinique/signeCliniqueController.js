//cheked 15/04/2026
import {
  createSigneClinique as createSigneCliniqueService,
  getSigneCliniqueByNumeroDossier as getSigneCliniqueByNumeroDossierService,
  updateSigneClinique as updateSigneCliniqueService,
} from "../../services/examenClinique/signeCliniqueService.js";
import { logAction } from "../../services/auditService.js";

export const createSigneCliniqueController = async (req, res) => {
  try {
    const signeData = req.body;
    const signe = await createSigneCliniqueService(signeData);

    await logAction(req, {
      module: "SIGNE_CLINIQUE",
      action: "SIGNE_CLINIQUE_CREATE",
      patient_id: signe.patient_id,
      entity_id: signe.id,
      old_data: null,
      new_data: signe,
    });

    res.status(201).json({
      success: true,
      message: "Signe clinique cree avec succes",
      signe,
    });
  } catch (error) {
    console.error("Erreur createSigneClinique:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSigneCliniqueByNumeroDossierController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
    const signes = await getSigneCliniqueByNumeroDossierService(numeroDossier);
    const firstSigne = Array.isArray(signes) && signes.length > 0 ? signes[0] : null;

    await logAction(req, {
      module: "SIGNE_CLINIQUE",
      action: "SIGNE_CLINIQUE_VIEW",
      patient_id: firstSigne?.patient_id ?? null,
      entity_id: firstSigne?.id ?? null,
      old_data: null,
      new_data: null,
    });

    res.status(200).json({
      success: true,
      signes,
    });
  } catch (error) {
    console.error("Get signe clinique by numero dossier error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSigneCliniqueController = async (req, res) => {
  try {
    const { id } = req.params;
    const signeData = req.body;

    const signe = await updateSigneCliniqueService(parseInt(id, 10), signeData);

    await logAction(req, {
      module: "SIGNE_CLINIQUE",
      action: "SIGNE_CLINIQUE_UPDATE",
      patient_id: signe.patient_id,
      entity_id: signe.id,
      old_data: null,
      new_data: signe,
    });

    res.status(200).json({
      success: true,
      message: "Signe clinique mis a jour avec succes",
      signe,
    });
  } catch (error) {
    console.error("Update signe clinique error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
