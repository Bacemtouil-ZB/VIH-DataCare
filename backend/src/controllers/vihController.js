import {
  createVih as createVihService,
  getVihById as getVihByIdService,
  getVihByPatientId as getVihByPatientIdService,
  updateVih as updateVihService,
  deleteVih as deleteVihService,
} from "../services/vihService.js";

export const createVihController = async (req, res) => {
  try {
    const vihData = req.body;
    const userId = req.user.id;

    const vih = await createVihService(vihData, userId);

    res.status(201).json({
      success: true,
      message: "Dossier VIH créé avec succès",
      vih,
    });
  } catch (error) {
    console.error("Create VIH error:", error.message);
    
    const statusCode = error.message.includes("existe déjà") ? 409 : 400;
    
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVihController = async (req, res) => {
  try {
    const { id } = req.params;
    const vih = await getVihByIdService(parseInt(id));

    res.status(200).json({
      success: true,
      vih,
    });
  } catch (error) {
    console.error("Get VIH error:", error.message);
    
    const statusCode = error.message.includes("non trouvé") ? 404 : 400;
    
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVihByPatientController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const vih = await getVihByPatientIdService(parseInt(patientId));

    res.status(200).json({
      success: true,
      vih,
    });
  } catch (error) {
    console.error("Get VIH by patient error:", error.message);
    
    const statusCode = error.message.includes("Aucun dossier") ? 404 : 400;
    
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateVihController = async (req, res) => {
  try {
    const { id } = req.params;
    const vihData = req.body;
    const userId = req.user.id;

    const vih = await updateVihService(parseInt(id), vihData, userId);

    res.status(200).json({
      success: true,
      message: "Dossier VIH mis à jour avec succès",
      vih,
    });
  } catch (error) {
    console.error("Update VIH error:", error.message);
    
    const statusCode = error.message.includes("non trouvé") ? 404 : 400;
    
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteVihController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteVihService(parseInt(id));

    res.status(200).json({
      success: true,
      message: "Dossier VIH supprimé avec succès",
    });
  } catch (error) {
    console.error("Delete VIH error:", error.message);
    
    const statusCode = error.message.includes("non trouvé") ? 404 : 400;
    
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};