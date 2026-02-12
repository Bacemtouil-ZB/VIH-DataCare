import {
  createExamenClinique as createExamenService,
  getExamenCliniqueById as getExamenByIdService,
  getExamensByPatientId as getExamensByPatientService,
  updateExamenClinique as updateExamenService,
} from "../services/examenCliniqueService.js";

export const createExamenController = async (req, res) => {
  try {
    const examenData = req.body;
    const userId = req.user.id;

    const examen = await createExamenService(examenData, userId);

    res.status(201).json({
      success: true,
      message: "Examen clinique créé avec succès",
      examen,
    });
  } catch (error) {
    console.error("Create examen error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getExamenController = async (req, res) => {
  try {
    const { id } = req.params;
    const examen = await getExamenByIdService(parseInt(id));

    res.status(200).json({
      success: true,
      examen,
    });
  } catch (error) {
    console.error("Get examen error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getExamensByPatientController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const examens = await getExamensByPatientService(parseInt(patientId));

    res.status(200).json({
      success: true,
      count: examens.length,
      examens,
    });
  } catch (error) {
    console.error("Get examens by patient error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateExamenController = async (req, res) => {
  try {
    const { id } = req.params;
    const examenData = req.body;
    const userId = req.user.id;

    const examen = await updateExamenService(parseInt(id), examenData, userId);

    res.status(200).json({
      success: true,
      message: "Examen clinique mis à jour avec succès",
      examen,
    });
  } catch (error) {
    console.error("Update examen error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
