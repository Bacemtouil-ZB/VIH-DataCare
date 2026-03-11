import {
  createConclusionService,
  listConclusionsByPatientService,
  updateConclusionService,
  getConclusionDetailsService,
} from "../services/doctorConclusionsService.js";
import { getPatientById, getPatientByNumero } from "../models/patientModel.js";

const resolvePatientId = async (patientParam) => {
  if (!patientParam) {
    throw new Error("Patient introuvable");
  }

  // Frontend can send patient numero like "050-2025".
  const patientByNumero = await getPatientByNumero(patientParam);
  if (patientByNumero?.id) {
    return Number(patientByNumero.id);
  }

  const numericId = Number(patientParam);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new Error("patient_id invalide");
  }

  const patientById = await getPatientById(numericId);
  if (!patientById?.id) {
    throw new Error("Patient introuvable");
  }

  return Number(patientById.id);
};

const toStatusCode = (message = "") => {
  if (/invalide|introuvable|obligatoire/i.test(message)) return 400;
  return 500;
};

export const createConclusionController = async (req, res) => {
  try {
    const doctor_id = req.user.id; // protect middleware must set req.user
    const patient_id = await resolvePatientId(req.params.patientId);
    const { content } = req.body;

    const data = await createConclusionService({
      patient_id,
      doctor_id,
      content,
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
    const patient_id = await resolvePatientId(req.params.patientId);
    const limit = Number(req.query.limit || 10);
    const offset = Number(req.query.offset || 0);

    const data = await listConclusionsByPatientService({
      patient_id,
      limit,
      offset,
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

    const data = await updateConclusionService({ id, doctor_id, content });
    res.json(data);
  } catch (error) {
    res.status(toStatusCode(error.message)).json({
      message: error.message || "Erreur mise a jour conclusion",
    });
  }
};
