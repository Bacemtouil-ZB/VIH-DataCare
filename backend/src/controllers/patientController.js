import {
  createPatient as createPatientService,
  getPatientById as getPatientByIdService,
  getAllPatients as getAllPatientsService,
  updatePatient as updatePatientService,
  searchPatient as searchPatientService,
} from "../services/patientService.js";


//Crée un nouveau patient

export const createPatientController = async (req, res) => {
  try {
    const patientData = req.body;
    const userId = req.user.id; 

    const patient = await createPatientService(patientData, userId);

    res.status(201).json({
      success: true,
      message: "Patient créé avec succès",
      patient
    });
  } catch (error) {
    console.error(" Create patient error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


//Récupère un patient par son ID

export const getPatientController = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await getPatientByIdService(parseInt(id));

    res.status(200).json({
      success: true,
      patient
    });
  } catch (error) {
    console.error(" Get patient error:", error.message);
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};


//Récupère tous les patients avec pagination et filtres

export const getAllPatientsController = async (req, res) => {
  try {
    const options = {
      name: req.query.name,
      surname: req.query.surname,
      city: req.query.city,
      gender: req.query.gender,
      sortOrder: req.query.sortOrder || 'DESC'
    };

    const result = await getAllPatientsService(options);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("Get all patients error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


//Met à jour un patient

export const updatePatientController = async (req, res) => {
  try {
    const { id } = req.params;
    const patientData = req.body;
    const userId = req.user.id;
    const patient = await updatePatientService(parseInt(id), patientData, userId);
    res.status(200).json({
      success: true,
      message: "Patient mis à jour avec succès",
      patient
    });
  } catch (error) {
    console.error("Update patient error:", error.message);
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};


 //Recherche des patients
export const searchPatientController = async (req, res) => {
  try {
    const { name, surname } = req.query;
    const patients = await searchPatientService(name, surname);

    res.status(200).json({
      success: true,
      count: patients.length,
      patients
    });
  } catch (error) {
    console.error("Search patient error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

