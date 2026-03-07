import API from "../../../shared/utils/api";

/**
 * Global audit logs (table view)
 * GET /audit/admin/logs
 * Query params supported (all optional):
 * - module, action, user_id, anomaly, from, to, limit, offset
 */
export const getGlobalAuditLogs = async ({
  module,
  action,
  user_id,
  anomaly,
  from,
  to,
  limit = 50,
  offset = 0,
} = {}) => {
  try {
    const res = await API.get("/audit/admin/logs", {
      params: {
        module,
        action,
        user_id,
        anomaly,
        from,
        to,
        limit,
        offset,
      },
    });
    return res.data; // {success, count, total, limit, offset, logs}
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Patient audit logs by exact numero (table view)
 * GET /audit/admin/patient/:numero
 */
export const getPatientAuditLogs = async (
  numero,
  { module, action, user_id, anomaly, from, to, limit = 50, offset = 0 } = {},
) => {
  try {
    if (!numero) throw new Error("numero patient requis");

    const res = await API.get(
      `/audit/admin/patient/${encodeURIComponent(numero)}`,
      {
        params: {
          module,
          action,
          user_id,
          anomaly,
          from,
          to,
          limit,
          offset,
        },
      },
    );
    return res.data; // {success, patient, count, total, limit, offset, logs}
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Audit log details (for modal)
 * GET /audit/admin/logs/:id
 */
export const getAuditLogDetails = async (id) => {
  try {
    if (!id) throw new Error("id requis");
    const res = await API.get(`/audit/admin/logs/${id}`);
    return res.data; // {success, log}
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
