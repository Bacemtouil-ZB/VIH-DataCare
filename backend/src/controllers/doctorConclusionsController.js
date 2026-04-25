import {
  createConclusionService,
  listConclusionsByPatientService,
  updateConclusionService,
  getConclusionDetailsService,
} from "../services/doctorConclusionsService.js";
import { logAction } from "../services/auditService.js";

const toStatusCode = (message = "") => {
  if (/invalide|introuvable|obligatoire/i.test(message)) return 400;
  return 500;
};

export const createConclusionController = async (req, res) => {
  try {
    const doctor_id = req.user.id;
    const numero = req.params.numero;
    const { content } = req.body;

    const data = await createConclusionService({
      numero,
      doctor_id,
      content,
    });

    await logAction(req, {
      module: "DOCTOR_CONCLUSION",
      action: "DOCTOR_CONCLUSION_CREATE",
      patient_id: data.conclusion?.patient_id || null,
      entity_id: data.conclusion?.id || null,
      old_data: null,
      new_data: data.conclusion || data,
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(toStatusCode(error.message)).json({
      message: error.message || "Erreur creation conclusion",
    });
  }
};

export const listConclusionsByPatientController = async (req, res) => {
  try {
    const numero = req.params.numero;
    const limit = Number(req.query.limit || 10);
    const offset = Number(req.query.offset || 0);

    const data = await listConclusionsByPatientService({
      numero,
      limit,
      offset,
    });

    await logAction(req, {
      module: "DOCTOR_CONCLUSION",
      action: "DOCTOR_CONCLUSION_LIST_VIEW",
      patient_id: data.conclusions?.[0]?.patient_id || null,
      entity_id: null,
      old_data: null,
      new_data: { numero, limit, offset },
    });

    res.json(data);
  } catch (error) {
    res.status(toStatusCode(error.message)).json({
      message: error.message || "Erreur lecture conclusions",
    });
  }
};

export const getConclusionDetailsController = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const data = await getConclusionDetailsService({ id });

    await logAction(req, {
      module: "DOCTOR_CONCLUSION",
      action: "DOCTOR_CONCLUSION_VIEW",
      patient_id: data.conclusion?.patient_id || null,
      entity_id: data.conclusion?.id || id,
      old_data: null,
      new_data: null,
    });

    res.json(data);
  } catch (error) {
    res.status(toStatusCode(error.message)).json({
      message: error.message || "Erreur lecture conclusion",
    });
  }
};

export const updateConclusionController = async (req, res) => {
  try {
    const doctor_id = req.user.id;
    const id = Number(req.params.id);
    const { content } = req.body;

    const data = await updateConclusionService({
      id,
      doctor_id,
      content,
    });

    await logAction(req, {
      module: "DOCTOR_CONCLUSION",
      action: "DOCTOR_CONCLUSION_UPDATE",
      patient_id: data.conclusion?.patient_id || null,
      entity_id: data.conclusion?.id || id,
      old_data: null,
      new_data: data.conclusion || data,
    });

    res.json(data);
  } catch (error) {
    res.status(toStatusCode(error.message)).json({
      message: error.message || "Erreur mise a jour conclusion",
    });
  }
};
