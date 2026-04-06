import { fetchActivePermission } from "../services/permissionService.js";

const BYPASS_ROLES = ["medecin"];

const PERMISSION_COLUMNS = {
  cv:  "can_view_viral_load",
  cd4: "can_view_cd4",
};

export const checkPermission = (type) => async (req, res, next) => {
  try {
    if (BYPASS_ROLES.includes(req.user.role)) return next();

    const patientId = req.user.id; // patient connecté

    const permission = await fetchActivePermission(patientId);

    if (!permission) {
      return res.status(403).json({
        success: false,
        code: "NO_PERMISSION",
        message: "Aucune autorisation active pour ce patient",
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