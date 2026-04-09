import {
  createConclusionService,
  listConclusionsByPatientService,
  updateConclusionService,
  getConclusionDetailsService,
} from "../services/doctorConclusionsService.js";

 // dosn't need audit logs because each doctor can only see and modify their own conclusions, so no risk of unauthorized access or modifications by other users.

const toStatusCode = (message = "") => { 
  if (/invalide|introuvable|obligatoire/i.test(message)) return 400;
  return 500;
};

export const createConclusionController = async (req, res) => {
  try {
    const doctor_id = req.user.id;
    const numero = req.params.numero; // patient numero
    const { content } = req.body;

    const data = await createConclusionService({
      numero,
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
    const numero = req.params.numero;
    const limit = Number(req.query.limit || 10);
    const offset = Number(req.query.offset || 0);

    const data = await listConclusionsByPatientService({
      numero,
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

    const data = await updateConclusionService({
      id,
      doctor_id,
      content,
    });

    res.json(data);
  } catch (error) {
    res.status(toStatusCode(error.message)).json({
      message: error.message || "Erreur mise a jour conclusion",
    });
  }
};
