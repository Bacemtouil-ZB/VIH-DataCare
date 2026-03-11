import {
  createConclusionService,
  listConclusionsByPatientService,
  updateConclusionService,
  getConclusionDetailsService,
} from "../services/conclusionService.js";

export const createConclusionController = async (req, res) => {
  const doctor_id = req.user.id; // protect middleware must set req.user
  const patientId = Number(req.params.patientId);
  const { content } = req.body;

  const data = await createConclusionService({
    patient_id: patientId,
    doctor_id,
    content,
  });
  res.status(201).json(data);
};

export const listConclusionsByPatientController = async (req, res) => {
  const patientId = Number(req.params.patientId);
  const limit = Number(req.query.limit || 10);
  const offset = Number(req.query.offset || 0);

  const data = await listConclusionsByPatientService({
    patient_id: patientId,
    limit,
    offset,
  });
  res.json(data);
};

export const getConclusionDetailsController = async (req, res) => {
  const id = Number(req.params.id);
  const data = await getConclusionDetailsService({ id });
  res.json(data);
};

export const updateConclusionController = async (req, res) => {
  const doctor_id = req.user.id;
  const id = Number(req.params.id);
  const { content } = req.body;

  const data = await updateConclusionService({ id, doctor_id, content });
  res.json(data);
};
