import {
  savePermission,
  fetchPermissionByNumero,
  resolvePatientId,
} from "../services/permissionService.js";
import { logAction } from "../services/auditService.js";

// POST /api/permissions
export const setPermissionController = async (req, res) => {
  try {
    const { numero, canViewViralLoad, canViewCd4, expiresAt } = req.body;
    const medecinId = req.user.id;

    const [old_data, patientId] = await Promise.all([
      fetchPermissionByNumero(numero),
      resolvePatientId(numero),
    ]);

    const permission = await savePermission({
      numero,
      medecinId,
      canViewViralLoad,
      canViewCd4,
      expiresAt,
    });

    await logAction(req, {
      module: "PERMISSION",
      action: "PERMISSION_SET",
      patient_id: patientId,
      entity_id: patientId, // UUID non supporté → patientId (int)
      old_data: old_data,
      new_data: permission,
    });

    return res.status(200).json({ success: true, data: permission });
  } catch (error) {
    console.error("setPermissionController error:", error);
    const status = error.message === "Patient non trouvé" ? 404 : 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};

// GET /api/permissions/:numero — pas de log
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