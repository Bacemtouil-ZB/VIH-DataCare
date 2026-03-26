import {
  addMedicalTreatment as addMedicalTreatmentService,
  findMedicalTreatmentByNumeroDossier as findByNumeroService,
  getThreeLastPrise as getThreeLastPriseService,
  getTreatmentStartDate as getTreatmentStartDateService,
  getNextIntakeDate as getNextIntakeDateService,
  getPrescriptionById as getPrescriptionByIdService,
  updatePrescription as updatePrescriptionService,
  getPatientsPerduDeVue as getPatientsPerduDeVueService,
  updateDateProchainePrise as updateDateProchainePriseService,
  getStatistiques as getStatistiquesService,
  validerPrescription as validerPrescriptionService,
} from "../services/prescriptionWorkflowServices.js";

export const addMedicalTreatmentController = async (req, res) => {
  try {
    const prescription = await addMedicalTreatmentService(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: "Prescription medicale ajoutee avec succes",
      prescription,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const findByNumeroDossierController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
    const payload = await findByNumeroService(numeroDossier);
    res.status(200).json({
      success: true,
      count: payload.prescriptions?.length || 0,
      prescriptions: payload.prescriptions || [],
      patient: payload.patient || null,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getThreeLastPriseController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
    const payload = await getThreeLastPriseService(numeroDossier);
    res.status(200).json({
      success: true,
      count: payload.prises?.length || 0,
      prises: payload.prises || [],
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getTreatmentStartDateController = async (req, res) => {
  try {
    const date = await getTreatmentStartDateService(Number.parseInt(req.params.id, 10));
    res.status(200).json({ success: true, date_debut_traitement: date });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getNextIntakeDateController = async (req, res) => {
  try {
    const date = await getNextIntakeDateService(Number.parseInt(req.params.id, 10));
    res.status(200).json({ success: true, date_prochaine_prise: date });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPrescriptionController = async (req, res) => {
  try {
    const prescription = await getPrescriptionByIdService(Number.parseInt(req.params.id, 10));
    res.status(200).json({ success: true, prescription });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updatePrescriptionController = async (req, res) => {
  try {
    const prescription = await updatePrescriptionService(
      Number.parseInt(req.params.id, 10),
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Prescription medicale mise a jour",
      prescription,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPatientsPerduDeVueController = async (_req, res) => {
  try {
    const patients = await getPatientsPerduDeVueService();
    res.status(200).json({ success: true, count: patients.length, patients });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateDateProchainePriseController = async (req, res) => {
  try {
    const prescription = await updateDateProchainePriseService(
      Number.parseInt(req.params.id, 10),
      req.body.date_prochaine_prise,
    );
    res.status(200).json({
      success: true,
      message: "Date de prochaine prise mise a jour",
      prescription,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const validerPrescriptionController = async (req, res) => {
  try {
    const prescription = await validerPrescriptionService(Number.parseInt(req.params.id, 10));
    res.status(200).json({
      success: true,
      message: "Prescription medicale delivree avec succes",
      prescription,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getStatistiquesController = async (_req, res) => {
  try {
    const stats = await getStatistiquesService();
    res.status(200).json({ success: true, stats });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
