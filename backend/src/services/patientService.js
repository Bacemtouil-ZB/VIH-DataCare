import {
  createPatient as createPatientModel,
  getPatientById as getPatientByIdModel,
  getPatientByNumero as getPatientByNumeroModel,
  getAllPatients as getAllPatientsModel,
  updatePatient as updatePatientModel,
  //searchPatients as searchPatientsModel,
  checkNumeroExists,
  countPatients,
  //updateLastVisitDate,
} from "../models/patientModel.js";

export const createPatient = async (patientData, userId) => {
  // Vérifier si le numéro est fourni et s'il existe déjà
  if (patientData.numero) {
    const exists = await checkNumeroExists(patientData.numero);
    if (exists) {
      throw new Error(`Le numéro de dossier ${patientData.numero} existe déjà`);
    }
  }

  const patient = await createPatientModel(patientData, userId);
  return patient;
};

export const getPatientById = async (id) => {
  const patient = await getPatientByIdModel(id);

  if (!patient) {
    throw new Error("Patient non trouvé");
  }
  return patient;
};
export const getPatientByNumero = async (numero) => {
  const patient = await getPatientByNumeroModel(numero);

  if (!patient) {
    throw new Error(`Patient avec le numéro ${numero} non trouvé`);
  }
  return patient;
};

export const checkPatientNumeroExists = async (numero) => {
  const exists = await checkNumeroExists(numero);

  if (exists) {
    const patient = await getPatientByNumeroModel(numero);
    return { exists: true, patient };
  }

  return { exists: false, patient: null };
};

export const getAllPatients = async (options = {}) => {
  const patients = await getAllPatientsModel(options);
  const total = await countPatients();

  return {
    patients,
    total,
    count: patients.length,
  };
};

export const updatePatient = async (id, patientData, userId) => {
  // Vérifier que le patient existe
  const patient = await getPatientByIdModel(id);
  if (!patient) {
    throw new Error("Patient non trouvé");
  }

  // Si le numéro est modifié, vérifier qu'il n'existe pas déjà
  if (patientData.numero && patientData.numero !== patient.numero) {
    const exists = await checkNumeroExists(patientData.numero);
    if (exists) {
      throw new Error(`Le numéro de dossier ${patientData.numero} existe déjà`);
    }
  }

  const updatedPatient = await updatePatientModel(id, patientData, userId);
  return updatedPatient;
};

// export const searchPatient = async (searchParams) => {
//   return await searchPatientsModel(searchParams);
// };

// export const updatePatientLastVisit = async (id) => {
//   const patient = await getPatientByIdModel(id);
//   if (!patient) {
//     throw new Error("Patient non trouvé");
//   }

//   return await updateLastVisitDate(id);
// };

// export const getNextPatientNumero = async () => {
//   return await getNextPatientNumeroModel();
// };
