import { createAuditLog } from "../models/auditModel.js";
import { v4 as uuidv4 } from "uuid";

export const logAction = async (req, data) => {
  await createAuditLog({
    request_id: uuidv4(),
    user_id: req.user?.id || data.user_id, // data.user_id est utilisé si req.user n'est pas défini dans login
    user_role: req.user?.role || data.user_role,
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

import {
  findPatientByNumero,
  getAuditLogsGlobal,
  countAuditLogsGlobal,
  getAuditLogsByPatientId,
  countAuditLogsByPatientId,
  getAuditLogDetailsById,
} from "../models/auditModel.js";

const parseBooleanOrNull = (value) => {
  if (value === undefined || value === null || value === "") return null;
  if (value === "true" || value === true) return true;
  if (value === "false" || value === false) return false;
  throw new Error("Paramètre anomaly invalide (true/false attendu)");
};

const parseIntWithDefault = (value, def) => {
  if (value === undefined || value === null || value === "") return def;
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) throw new Error("Paramètre pagination invalide");
  return n;
};

export const listGlobalAuditLogs = async (query) => {
  const limit = parseIntWithDefault(query.limit, 50);
  const offset = parseIntWithDefault(query.offset, 0);

  if (limit < 1 || limit > 200)
    throw new Error("limit doit être entre 1 et 200");
  if (offset < 0) throw new Error("offset doit être >= 0");

  const filters = {
    module: query.module || null,
    action: query.action || null,
    userId: query.user_id ? parseIntWithDefault(query.user_id, null) : null,
    anomaly: parseBooleanOrNull(query.anomaly),
    from: query.from || null,
    to: query.to || null,
    limit,
    offset,
  };

  const [logs, total] = await Promise.all([
    getAuditLogsGlobal(filters),
    countAuditLogsGlobal(filters),
  ]);

  return { logs, total, limit, offset };
};

export const listPatientAuditLogsByNumero = async (numero, query) => {
  if (!numero) throw new Error("numero patient requis");

  const patient = await findPatientByNumero(numero);
  if (!patient) {
    const err = new Error("Patient introuvable");
    err.statusCode = 404;
    throw err;
  }

  const limit = parseIntWithDefault(query.limit, 50);
  const offset = parseIntWithDefault(query.offset, 0);

  if (limit < 1 || limit > 200)
    throw new Error("limit doit être entre 1 et 200");
  if (offset < 0) throw new Error("offset doit être >= 0");

  const filters = {
    patientId: patient.id,
    module: query.module || null,
    action: query.action || null,
    userId: query.user_id ? parseIntWithDefault(query.user_id, null) : null,
    anomaly: parseBooleanOrNull(query.anomaly),
    from: query.from || null,
    to: query.to || null,
    limit,
    offset,
  };

  const [logs, total] = await Promise.all([
    getAuditLogsByPatientId(filters),
    countAuditLogsByPatientId(filters),
  ]);

  return { patient, logs, total, limit, offset };
};

export const getAuditLogDetails = async (id) => {
  const logId = parseIntWithDefault(id, null);
  if (!logId) throw new Error("id requis");

  const log = await getAuditLogDetailsById(logId);
  if (!log) {
    const err = new Error("Audit log introuvable");
    err.statusCode = 404;
    throw err;
  }

  return log;
};
