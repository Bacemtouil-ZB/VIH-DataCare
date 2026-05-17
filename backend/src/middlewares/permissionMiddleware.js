import { fetchActivePermission } from "../services/permissionService.js";

const BYPASS_ROLES = ["medecin"];

const PERMISSION_COLUMNS = {
  cv: "can_view_viral_load",
  cd4: "can_view_cd4",
};

export const checkPermission = (type) => async (req, res, next) => {
  try {
    //  1. Vérifier user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non authentifié",
      });
    }

    if (BYPASS_ROLES.includes(req.user.role)) {
      return next();
    }

    //  3. Vérifier type demandé
    if (!PERMISSION_COLUMNS[type]) {
      return res.status(400).json({
        success: false,
        message: "Type de permission invalide",
      });
    }

    const patientId = req.user.patient_id;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Identifiant patient introuvable",
      });
    }

    //  Récupérer permission active
    const permission = await fetchActivePermission(patientId);

    if (!permission) {
      return res.status(403).json({
        success: false,
        code: "NO_PERMISSION",
        message: "Aucune autorisation active",
      });
    }

    if (new Date(permission.expires_at) <= new Date()) {
      return res.status(403).json({
        success: false,
        code: "EXPIRED",
        message: "Autorisation expirée",
      });
    }

    if (!permission[PERMISSION_COLUMNS[type]]) {
      return res.status(403).json({
        success: false,
        code: "ACCESS_DENIED",
        message: "Accès non autorisé par votre médecin",
      });
    }

    next();

  } catch (error) {
    console.error("checkPermission error:", error);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur permission",
    });
  }
};