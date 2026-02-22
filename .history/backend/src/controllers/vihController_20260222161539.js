import {
  createVih as createVihService,
  getVihById as getVihByIdService,
<<<<<<< HEAD
  getVihByPatientId as getVihByPatientIdService,
=======
  getVihByNumeroDossier as getVihByNumeroDossierService,
>>>>>>> origin/feature/vih
  updateVih as updateVihService,
} from "../services/vihService.js";

export const createVihController = async (req, res) => {
  try {
    const vihData = req.body;
    const userId = req.user.id;
<<<<<<< HEAD

=======
>>>>>>> origin/feature/vih
    const vih = await createVihService(vihData, userId);

    res.status(201).json({
      success: true,
      message: "Dossier VIH créé avec succès",
      vih,
    });
  } catch (error) {
    console.error("Create VIH error:", error.message);
<<<<<<< HEAD
    
    const statusCode = error.message.includes("existe déjà") ? 409 : 400;
    
    res.status(statusCode).json({
=======
        res.status(400).json({
>>>>>>> origin/feature/vih
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
<<<<<<< HEAD
    
    const statusCode = error.message.includes("non trouvé") ? 404 : 400;
    
    res.status(statusCode).json({
=======
    res.status(404).json({
>>>>>>> origin/feature/vih
      success: false,
      message: error.message,
    });
  }
};

<<<<<<< HEAD
export const getVihByPatientController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const vih = await getVihByPatientIdService(parseInt(patientId));
=======
export const getVihByNumeroDossierController = async (req, res) => {
  try {
    const { numero } = req.params;
    const vih = await getVihByNumeroDossierService(numero);
>>>>>>> origin/feature/vih

    res.status(200).json({
      success: true,
      vih,
    });
  } catch (error) {
<<<<<<< HEAD
    console.error("Get VIH by patient error:", error.message);
    
    const statusCode = error.message.includes("Aucun dossier") ? 404 : 400;
    
    res.status(statusCode).json({
=======
    console.error("Get VIH by numero dossier error:", error.message);  
    res.status(404).json({
>>>>>>> origin/feature/vih
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
<<<<<<< HEAD
    console.error("Update VIH error:", error.message);
    
    const statusCode = error.message.includes("non trouvé") ? 404 : 400;
    
    res.status(statusCode).json({
=======
    console.error("Update VIH error:", error.message);    
    res.status(400).json({
>>>>>>> origin/feature/vih
      success: false,
      message: error.message,
    });
  }
<<<<<<< HEAD
};
=======
};
>>>>>>> origin/feature/vih
