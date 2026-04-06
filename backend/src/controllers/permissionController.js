import {
  savePermission,
  fetchPermissionByNumero,
} from "../services/permissionService.js";

// POST /api/permissions
export const setPermissionController = async (req, res) => {
  try {
    const { numero, canViewViralLoad, canViewCd4, expiresAt } = req.body;
    const medecinId = req.user.id;

    const permission = await savePermission({
      numero,
      medecinId,
      canViewViralLoad,
      canViewCd4,
      expiresAt,
    });

    return res.status(200).json({ success: true, data: permission });
  } catch (error) {
    console.error("setPermissionController error:", error);
    const status = error.message === "Patient non trouvé" ? 404 : 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};

// GET /api/permissions/:numero
export const getPermissionController = async (req, res) => {
  try {
    const { numero } = req.params;

    const permission = await fetchPermissionByNumero(numero);

    return res.status(200).json({ success: true, data: permission ?? null });
  } catch (error) {
    console.error("getPermissionController error:", error);
    const status = error.message === "Patient non trouvé" ? 404 : 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};