import API from "../../../shared/utils/api";

export const getPatientsWithPrescriptions = async () => {
  try {
    const response = await API.get("/patients/prescriptions-medicales");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// New function to get next rendezvous per patient
export const getNextRendezVousPerPatient = async () => {
  const response = await API.get("/rendezVous/next-all");
  const rows = response.data || [];
 
  const map = {};
  rows.forEach((rdv) => {
    map[rdv.patient_id] = {
      date:   rdv.date,
      heure:  rdv.heure,
      type:   rdv.type,
      statut: rdv.statut,
    };
  });
  return map; // { [patient_id]: { date, heure, type, statut } }
};


export default {
  getPatientsWithPrescriptions,
  getNextRendezVousPerPatient,
  
};
