import {
  getSocialByNumero as getSocialByNumeroService,
  createSocial as createSocialService,
  updateSocial as updateSocialService,
} from "../services/socialService.js";
import { logAction } from "../services/auditService.js";

// Récupérer la fiche sociale par numéro
export const getSocialByNumero = async (req, res) => {
  try {
    const { numero } = req.params;
    const social = await getSocialByNumeroService(numero);

    // Audit log pour VIEW
    await logAction(req, {
      module: "SOCIAL",
      action: "SOCIAL_VIEW",
      patient_id: social.patient_id,
      entity_id: social.id,
      old_data: null,
      new_data: null,
    });

    if (!social) {
      return res.status(404).json({
        success: false,
        message: "Aucune fiche sociale trouvée pour ce patient",
      });
    }

    //

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

    await logAction(req, {
      module: "SOCIAL",
      action: "SOCIAL_CREATE",
      patient_id: social.patient_id,
      entity_id: social.id,
      old_data: null,
      new_data: social,
    });

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

    const oldSocial = await getSocialByNumeroService(numero);

    const social = await updateSocialService(numero, socialData, userId);
    await logAction(req, {
      module: "SOCIAL",
      action: "SOCIAL_UPDATE",
      patient_id: social.patient_id,
      entity_id: social.id,
      old_data: oldSocial,
      new_data: social,
    });

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
