import {
  createPatient as createPatientModel,
  getPatientById as getPatientByIdModel,
  getAllPatients as getAllPatientsModel,
  updatePatient as updatePatientModel,
  searchPatient as searchPatientModel,
  checkPatientExists,
} from "../models/patientModel.js";


//Crée un nouveau patient

export const createPatient = async (patientData, userId) => {
  const {      name, surname, birthdate, gender, city, state, postalcode,
      nationality, height, modeoftransmission, maritalstatus,
      numberchildren, educationlevel, housing, } = patientData;
  const exists = await checkPatientExists(name, surname, birthdate);
  if (exists) {
    throw new Error('Un patient avec ce nom, prénom et date de naissance existe déjà');
  }
  const birthDate = new Date(birthdate);
  const today = new Date();
  if (birthDate > today) {
    throw new Error('La date de naissance ne peut pas être dans le futur');
  }

  const age = today.getFullYear() - birthDate.getFullYear();
  if (age > 150) {
    throw new Error('La date de naissance semble incorrecte');
  }
  if (patientData.height && (patientData.height < 30 || patientData.height > 300)) {
    throw new Error('La taille doit être entre 30 et 300 cm');
  }
  if (patientData.numberchildren && patientData.numberchildren < 0) {
    throw new Error('Le nombre d\'enfants ne peut pas être négatif');
  }
  const patient = await createPatientModel(patientData, userId);
  return patient;
};

/**
 * Récupère un patient par son ID
 */
export const getPatientById = async (id) => {
  const patient = await getPatientByIdModel(id);
  if (!patient) {
    throw new Error('Patient non trouvé');
  }
  return patient;
};

 //Récupère tous les patients avec filtres et pagination

export const getAllPatients = async (options) => {
  return await getAllPatientsModel(options);
};

 //Met à jour un patient

export const updatePatient = async (id, patientData, userId) => {
  const patient = await getPatientByIdModel(id);
  if (!patient) {
    throw new Error('Patient non trouvé');
  }

  if (patientData.birthdate) {
    const birthDate = new Date(patientData.birthdate);
    const today = new Date();
    
    if (birthDate > today) {
      throw new Error('La date de naissance ne peut pas être dans le futur');
    }
  }
  if (patientData.height && (patientData.height < 30 || patientData.height > 300)) {
    throw new Error('La taille doit être entre 30 et 300 cm');
  }
  if (patientData.numberchildren !== undefined && patientData.numberchildren < 0) {
    throw new Error('Le nombre d\'enfants ne peut pas être négatif');
  }
  const updatedPatient = await updatePatientModel(id, patientData, userId);
  return updatedPatient;
};


 //Recherche des patients
export const searchPatient = async (name, surname) => {
  if (!name && !surname) {
    throw new Error('Vous devez fournir au moins un nom ou un prénom');
  }
  return await searchPatientModel(name || '', surname || '');
};

