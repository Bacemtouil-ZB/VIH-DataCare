import { createExamenClinique, getExamenCliniqueById, getExamensByNumeroDossier, updateExamenClinique } from "../models/examenCliniqueModel.js";
import { getPatientByNumero } from "../models/patientModel.js";

/**
 * ==========================================
 * CONTROLLER EXAMEN CLINIQUE
 * ==========================================
 */

/**
 * Créer un examen clinique
 */
export const createExamenCliniqueController = async (req, res) => {
  try {
    const { patient_numero, date_examen } = req.body;
    const medecinId = req.user.id;

    // Vérifier que le patient existe
    const patient = await getPatientByNumero(patient_numero);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient non trouvé"
      });
    }

    // Créer l'examen
    const examen = await createExamenClinique({
      patient_id: patient.id,
      date_examen: date_examen || new Date(),
    }, medecinId);

    res.status(201).json({
      success: true,
      message: "Examen clinique créé avec succès",
      examen
    });
  } catch (error) {
    console.error("Erreur création examen:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Erreur lors de la création de l'examen"
    });
  }
};

/**
 * Récupérer un examen par ID
 */
export const getExamenCliniqueController = async (req, res) => {
  try {
    const { id } = req.params;

    const examen = await getExamenCliniqueById(id);

    if (!examen) {
      return res.status(404).json({
        success: false,
        message: "Examen non trouvé"
      });
    }

    res.status(200).json({
      success: true,
      examen
    });
  } catch (error) {
    console.error("Erreur récupération examen:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Récupérer tous les examens d'un patient
 */
export const getExamensByPatientController = async (req, res) => {
  try {
    const { numero } = req.params;

    const examens = await getExamensByNumeroDossier(numero);

    res.status(200).json({
      success: true,
      examens
    });
  } catch (error) {
    console.error("Erreur récupération examens:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Mettre à jour un examen
 */
export const updateExamenCliniqueController = async (req, res) => {
  try {
    const { id } = req.params;
    const { date_examen } = req.body;

    const examen = await updateExamenClinique(id, { date_examen });

    res.status(200).json({
      success: true,
      message: "Examen mis à jour avec succès",
      examen
    });
  } catch (error) {
    console.error("Erreur mise à jour examen:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};