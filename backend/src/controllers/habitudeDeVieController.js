import {
  createHabitudeDeVie as createHabitudeDeVieService,
  getHabitudeDeVieById as getHabitudeDeVieByIdService,
  getHabitudeDeVieByNumeroDossier as getHabitudeDeVieByNumeroDossierService,
  updateHabitudeDeVie as updateHabitudeDeVieService,
} from "../services/habitudeDeVieService.js";


export const createHabitudeDeVieController = async (req, res) => {
  try {
    const habitudeData = req.body;
    const userId = req.user.id;
    
    const habitude = await createHabitudeDeVieService(habitudeData, userId);

    res.status(201).json({
      success: true,
      message: "Habitudes de vie créées avec succès",
      habitude,
    });
  } catch (error) {
    console.error("Create habitude error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHabitudeDeVieController = async (req, res) => {
  try {
    const { id } = req.params;
    const habitude = await getHabitudeDeVieByIdService(parseInt(id));

    res.status(200).json({
      success: true,
      habitude,
    });
  } catch (error) {
    console.error("Get habitude error:", error.message);
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};


export const getHabitudeDeVieByNumeroDossierController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
    const habitudes = await getHabitudeDeVieByNumeroDossierService(numeroDossier);

    res.status(200).json({
      success: true,
      habitudes, 
    });
  } catch (error) {
    console.error("Get habitude by numero error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateHabitudeDeVieController = async (req, res) => {
  try {
    const { id } = req.params;
    const habitudeData = req.body;
    const userId = req.user.id;

    const habitude = await updateHabitudeDeVieService(parseInt(id), habitudeData, userId);

    res.status(200).json({
      success: true,
      message: "Habitudes de vie mises à jour avec succès",
      habitude,
    });
  } catch (error) {
    console.error("Update habitude error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};