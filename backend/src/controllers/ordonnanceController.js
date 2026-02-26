import {
  addMedicalTreatment as addMedicalTreatmentService,
  findMedicalTreatmentByNumeroDossier as findByNumeroService,
  getThreeLastPrise as getThreeLastPriseService,
  getTreatmentStartDate as getTreatmentStartDateService,
  getNextIntakeDate as getNextIntakeDateService,
  getOrdonnanceById as getOrdonnanceByIdService,
  updateOrdonnance as updateOrdonnanceService,
  getPatientsPerduDeVue as getPatientsPerduDeVueService,
  updateDateProchainePrise as updateDateProchainePriseService,
  getStatistiques as getStatistiquesService,
} from "../services/ordonnanceServices.js";

export const addMedicalTreatmentController = async (req, res) => {
  try {
    const treatmentData = req.body;
    const medecinId = req.user.id;

    const ordonnance = await addMedicalTreatmentService(treatmentData, medecinId);

    res.status(201).json({
      success: true,
      message: "Traitement ajouté avec succès",
      ordonnance,
    });
  } catch (error) {
    console.error("Add medical treatment error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const findByNumeroDossierController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
    const ordonnances = await findByNumeroService(numeroDossier);

    res.status(200).json({
      success: true,
      count: ordonnances.length,
      ordonnances,
    });
  } catch (error) {
    console.error("Find by numero error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getThreeLastPriseController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
    const prises = await getThreeLastPriseService(numeroDossier);

    res.status(200).json({
      success: true,
      count: prises.length,
      prises,
    });
  } catch (error) {
    console.error("Get three last prise error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTreatmentStartDateController = async (req, res) => {
  try {
    const { id } = req.params;
    const date = await getTreatmentStartDateService(parseInt(id));

    res.status(200).json({
      success: true,
      date_debut_traitement: date,
    });
  } catch (error) {
    console.error("Get treatment start date error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getNextIntakeDateController = async (req, res) => {
  try {
    const { id } = req.params;
    const date = await getNextIntakeDateService(parseInt(id));

    res.status(200).json({
      success: true,
      date_prochaine_prise: date,
    });
  } catch (error) {
    console.error("Get next intake date error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrdonnanceController = async (req, res) => {
  try {
    const { id } = req.params;
    const ordonnance = await getOrdonnanceByIdService(parseInt(id));

    res.status(200).json({
      success: true,
      ordonnance,
    });
  } catch (error) {
    console.error("Get ordonnance error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrdonnanceController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const ordonnance = await updateOrdonnanceService(parseInt(id), data);

    res.status(200).json({
      success: true,
      message: "Ordonnance mise à jour",
      ordonnance,
    });
  } catch (error) {
    console.error("Update ordonnance error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPatientsPerduDeVueController = async (req, res) => {
  try {
    const patients = await getPatientsPerduDeVueService();

    res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error("Get patients perdu de vue error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDateProchainePriseController = async (req, res) => {
  try {
    const { id } = req.params;
    const { date_prochaine_prise } = req.body;

    const ordonnance = await updateDateProchainePriseService(
      parseInt(id),
      date_prochaine_prise
    );

    res.status(200).json({
      success: true,
      message: "Date de prochaine prise mise à jour",
      ordonnance,
    });
  } catch (error) {
    console.error("Update date prochaine prise error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// statistiques
export const getStatistiquesController = async (req, res) => {
  try {
    const stats = await getStatistiquesService();

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Get statistiques error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};