import {
  createPatientConclusionService,
  updatePatientConclusionService,
  listPatientConclusionsService,
  getConclusionDetailsService,
} from "../services/doctorConclusionsService.js";

export async function createPatientConclusionController(req, res, next) {
  try {
    const { numero } = req.params; // patient numero
    const { content } = req.body;
    const doctorId = req.user.id; // from protect middleware

    const data = await createPatientConclusionService({
      patientNumero: numero,
      doctorId,
      content,
    });
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
}

export async function updatePatientConclusionController(req, res, next) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const doctorId = req.user.id;

    const data = await updatePatientConclusionService({
      id: Number(id),
      doctorId,
      content,
    });
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function listPatientConclusionsController(req, res, next) {
  try {
    const { numero } = req.params;
    const { limit, offset } = req.query;

    const data = await listPatientConclusionsService({
      patientNumero: numero,
      limit,
      offset,
    });
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getConclusionDetailsController(req, res, next) {
  try {
    const { id } = req.params;
    const data = await getConclusionDetailsService({ id: Number(id) });
    res.json(data);
  } catch (e) {
    next(e);
  }
}
