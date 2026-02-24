import {
  createSignesFonctionnels as createSignesService,
  getSignesByNumeroDossier as getSignesByNumeroService,
  updateSignesFonctionnels as updateSignesService,
  getAppareils,
} from "../services/signeFonctionService.js";


export const createSignesFonctionnelsController = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.user.id;

    const result = await createSignesService(data, userId);

    res.status(201).json({
      success: true,
      message: "Signes fonctionnels créés avec succès",
      data: result,
    });
  } catch (error) {
    console.error("Create signes fonctionnels error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSignesByPatientController = async (req, res) => {
  try {
    const { numero } = req.params;
    const signes = await getSignesByNumeroService(numero);

    res.status(200).json({
      success: true,
      signes,
    });
  } catch (error) {
    console.error("Get signes by patient error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};




export const updateSignesFonctionnelsController = async (req, res) => {
  try {
    const { examenId } = req.params;
    const data = req.body;
    const userId = req.user.id;

    const signes = await updateSignesService(parseInt(examenId), data, userId);

    res.status(200).json({
      success: true,
      message: "Signes fonctionnels mis à jour avec succès",
      signes,
    });
  } catch (error) {
    console.error("Update signes error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAppareilsController = async (req, res) => {
  try {
    const appareils = await getAppareils();

    res.status(200).json({
      success: true,
      appareils,
    });
  } catch (error) {
    console.error("Get appareils error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};