import {
  createPatient as createPatientModel,
  getPatientById as getPatientByIdModel,
  getPatientByNumero as getPatientByNumeroModel,
  getAllPatients as getAllPatientsModel,
  updatePatient as updatePatientModel,
  checkNumeroExists,
  countPatients,
} from "../models/patientModel.js";
import { stripNumeroPrefix, canonicalNumero } from "../utils/numero.js";
import pool from "../config/db.js";

export const createPatient = async (patientData, userId) => {
  const client = await pool.connect();
  try {
    const data = { ...patientData };
    data.numero = canonicalNumero(data.numero, data.hospitalisation);

    // check uniqueness using canonical value
    if (data.numero) {
      const exists = await checkNumeroExists(data.numero);
      if (exists)
        throw new Error(`Le numéro de dossier ${data.numero} existe déjà`);
    }

    if (patientData.birthdate) {
      const birth = new Date(patientData.birthdate);
      const today = new Date();
      const minDate = new Date("1900-01-01");

      if (isNaN(birth.getTime())) {
        throw new Error("Date de naissance invalide");
      }
      if (birth < minDate || birth >= today) {
        throw new Error("Date de naissance invalide");
      }
    }
    const patient = await createPatientModel(client, data, userId);
    return patient;
  } finally {
    client.release();
  }
};

export const getPatientById = async (id) => {
  const patient = await getPatientByIdModel(id);

  if (!patient) {
    throw new Error("Patient non trouvé");
  }
  return patient;
};

export const getPatientByNumero = async (numero) => {
  const raw = stripNumeroPrefix(numero);

  // Try both forms
  const patient =
    (await getPatientByNumeroModel(`F-${raw}`)) ||
    (await getPatientByNumeroModel(raw));

  if (!patient) {
    throw new Error(`Patient avec le numéro ${numero} non trouvé`);
  }
  return patient;
};

export const checkPatientNumeroExists = async (numero) => {
  const rawNumero = stripNumeroPrefix(numero);

  const exists = await checkNumeroExists(rawNumero);
  if (exists) {
    const patient = await getPatientByNumeroModel(rawNumero);
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

// export const updatePatient = async (id, patientData, userId) => {
export const updatePatient = async (id, patientData, userId) => {
  const patient = await getPatientByIdModel(id);
  if (!patient) throw new Error("Patient non trouvé");

  const data = { ...patientData };

  // Decide which hospitalisation will be used after update
  const nextHosp = data.hospitalisation ?? patient.hospitalisation;

  // Decide which raw numero to use (if frontend didn't send numero, keep existing one)
  const baseNumero = data.numero ?? patient.numero;

  // Build canonical numero to store
  const nextNumero = canonicalNumero(baseNumero, nextHosp);
  if (nextNumero) data.numero = nextNumero;

  // Uniqueness check if numero changes
  if (data.numero && data.numero !== patient.numero) {
    const exists = await checkNumeroExists(data.numero);
    if (exists)
      throw new Error(`Le numéro de dossier ${data.numero} existe déjà`);
  }

  return await updatePatientModel(id, data, userId);
};
