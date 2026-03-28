import {
  getSuiviByPatientId,
  getSuiviByNumeroDossier,

} from "../models/suiviTherapeutiqueModel.js";
import { SuiviTherapeutique } from "./suiviTherapeutique/SuiviTherapeutique.js";

/**
 * Récupérer le suivi d'un patient avec calcul du statut
 */
export const getSuiviByPatient = async (patientId) => {
  const suivis = await getSuiviByPatientId(patientId);
  
  return suivis.map((suivi) => {
    const computed = new SuiviTherapeutique(suivi.date_prochaine_prise).toJSON();
    
    return {
      ...suivi,
      statut_patient: computed.statut_patient,
      ecart_jours: computed.ecart_jours,
      date_ecart: computed.date_ecart,
    };
  });
};

/**
 * Récupérer le suivi par numéro de dossier
 */
export const getSuiviByNumero = async (numeroDossier) => {
  const suivis = await getSuiviByNumeroDossier(numeroDossier);
  
  return suivis.map((suivi) => {
    const computed = new SuiviTherapeutique(suivi.date_prochaine_prise).toJSON();
    
    return {
      ...suivi,
      statut_patient: computed.statut_patient,
      ecart_jours: computed.ecart_jours,
      date_ecart: computed.date_ecart,
    };
  });
};
