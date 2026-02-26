import { createAuditLog } from "../models/auditModel.js";
import { v4 as uuidv4 } from "uuid";

export const logAction = async (req, data) => {
  await createAuditLog({
    request_id: uuidv4(),
    user_id: req.user?.id,
    user_role: req.user?.role,
    patient_id: data.patient_id || null,
    module: data.module,
    action: data.action,
    entity_id: data.entity_id || null,
    old_data: data.old_data || null,
    new_data: data.new_data || null,
    ip_address: req.ip,
    user_agent: req.headers["user-agent"],
    is_anomaly: data.is_anomaly || false,
  });
};
