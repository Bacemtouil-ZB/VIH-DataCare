import {
  listGlobalAuditLogs,
  listPatientAuditLogsByNumero,
  getAuditLogDetails,
} from "../services/auditService.js";

// GET /audit/admin/logs
export const listGlobalAuditLogsController = async (req, res) => {
  try {
    const { logs, total, limit, offset } = await listGlobalAuditLogs(req.query);

    return res.status(200).json({
      success: true,
      count: logs.length,
      total,
      limit,
      offset,
      logs,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /audit/admin/patient/:numero
export const listPatientAuditLogsController = async (req, res) => {
  const { numero } = req.params;

  try {
    const { patient, logs, total, limit, offset } =
      await listPatientAuditLogsByNumero(numero, req.query);

    return res.status(200).json({
      success: true,
      patient,
      count: logs.length,
      total,
      limit,
      offset,
      logs,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /audit/admin/logs/:id
export const getAuditLogDetailsController = async (req, res) => {
  const { id } = req.params;

  try {
    const log = await getAuditLogDetails(id);

    return res.status(200).json({
      success: true,
      log,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};
