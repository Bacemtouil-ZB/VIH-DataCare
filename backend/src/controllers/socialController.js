import {
  getSocialByNumero as getSocialByNumeroService,
  createSocial as createSocialService,
  updateSocial as updateSocialService,
} from "../services/socialService.js";

// Récupérer la fiche sociale par numéro
export const getSocialByNumero = async (req, res) => {
  try {
    const { numero } = req.params;
    const social = await getSocialByNumeroService(numero);

    if (!social) {
      return res.status(404).json({
        success: false,
        message: "Aucune fiche sociale trouvée pour ce patient",
      });
    }

    res.status(200).json({
      success: true,
      social,
    });
  } catch (error) {
    console.error("Get social error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Créer une fiche sociale
export const createSocial = async (req, res) => {
  try {
    const { numero } = req.params;
    const socialData = req.body;
    const userId = req.user.id;

    const social = await createSocialService(numero, socialData, userId);

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

// Mettre à jour une fiche sociale
export const updateSocial = async (req, res) => {
  try {
    const { numero } = req.params;
    const socialData = req.body;
    const userId = req.user.id;

    const social = await updateSocialService(numero, socialData, userId);
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
