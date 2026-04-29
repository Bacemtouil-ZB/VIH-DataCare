import {
  getSuiviByPatientId,
  getSuiviByNumeroDossier,
  syncStatutPatient,
} from "../models/suiviTherapeutiqueModel.js";


export const getSuiviByPatient = async (patientId) => {
  return getSuiviByPatientId(patientId);
};

export const getSuiviByNumero = async (numeroDossier) => {
  return getSuiviByNumeroDossier(numeroDossier);
};


export const syncSuiviStatuts = async () => {
  return syncStatutPatient();
};