import {
  createSocial as createSocialService,
  getSocialById as getSocialByIdService,
  getSocialByPatientId as getSocialByPatientIdService,
  checkSocialExistsForPatient,
  updateSocial as updateSocialService,
 
} from "../services/socialService.js";

export const createSocialController = async (req, res) => {
  try {
    const socialData = req.body;
    const userId = req.user.id; // jeya mn jwt

    const social = await createSocialService(socialData, userId);

    res.status(201).json({
      success: true,
      message: "Fiche sociale créée avec succès",
      social,
    });
  } catch (error) {
    console.error("Create social error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSocialController = async (req, res) => {
  try {
    const { id } = req.params; //route
    const social = await getSocialByIdService(parseInt(id));

    res.status(200).json({
      success: true,
      social,
    });
  } catch (error) {
    console.error("Get social error:", error.message);
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSocialByPatientController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const social = await getSocialByPatientIdService(parseInt(patientId));

    res.status(200).json({
      success: true,
      social,
    });
  } catch (error) {
    console.error("Get social by patient error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkSocialExistsController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const result = await checkSocialExistsForPatient(parseInt(patientId));

    res.status(200).json({
      success: true,
      exists: result.exists,
      social: result.social,
    });
  } catch (error) {
    console.error("Check social exists error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSocialController = async (req, res) => {
  try {
    const { id } = req.params;
    const socialData = req.body;
    const userId = req.user.id;

    const social = await updateSocialService(
      parseInt(id),
      socialData,
      userId
    );

    res.status(200).json({
      success: true,
      message: "Fiche sociale mise à jour avec succès",
      social,
    });
  } catch (error) {
    console.error("Update social error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
