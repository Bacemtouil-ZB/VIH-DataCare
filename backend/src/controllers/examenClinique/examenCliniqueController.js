import { createExamenClinique, getExamensByNumeroDossier, updateExamenClinique } from "../../models/examenClinique/examenCliniqueModel.js";
import { getPatientByNumero } from "../../models/patientModel.js";
import { logAction } from "../../services/auditService.js";

export const createExamenCliniqueController = async (req, res) => {
  try {
    const { patient_numero, date_examen } = req.body;
    const medecinId = req.user.id;

    const patient = await getPatientByNumero(patient_numero);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient non trouve",
      });
    }

    const examen = await createExamenClinique(
      {
        patient_id: patient.id,
        date_examen: date_examen || new Date(),
      },
      medecinId
    );

    await logAction(req, {
      module: "EXAMEN_CLINIQUE",
      action: "EXAMEN_CLINIQUE_CREATE",
      patient_id: examen.patient_id,
      entity_id: examen.id,
      old_data: null,
      new_data: examen,
    });

    res.status(201).json({
      success: true,
      message: "Examen clinique cree avec succes",
      examen,
    });
  } catch (error) {
    console.error("Erreur creation examen:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Erreur lors de la creation de l'examen",
    });
  }
};

export const getExamensByPatientController = async (req, res) => {
  try {
    const { numero } = req.params;
    const examens = await getExamensByNumeroDossier(numero);
    const firstExamen = Array.isArray(examens) && examens.length > 0 ? examens[0] : null;

    await logAction(req, {
      module: "EXAMEN_CLINIQUE",
      action: "EXAMEN_CLINIQUE_VIEW",
      patient_id: firstExamen?.patient_id ?? null,
      entity_id: firstExamen?.id ?? null,
      old_data: null,
      new_data: null,
    });

    res.status(200).json({
      success: true,
      examens,
    });
  } catch (error) {
    console.error("Erreur recuperation examens:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateExamenCliniqueController = async (req, res) => {
  try {
    const { id } = req.params;
    const { date_examen } = req.body;

    const examen = await updateExamenClinique(id, { date_examen });

    await logAction(req, {
      module: "EXAMEN_CLINIQUE",
      action: "EXAMEN_CLINIQUE_UPDATE",
      patient_id: examen.patient_id,
      entity_id: examen.id,
      old_data: null,
      new_data: examen,
    });

    res.status(200).json({
      success: true,
      message: "Examen mis a jour avec succes",
      examen,
    });
  } catch (error) {
    console.error("Erreur mise a jour examen:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
