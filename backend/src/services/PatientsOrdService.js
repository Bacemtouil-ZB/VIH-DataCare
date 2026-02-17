import { getPatientsWithOrdonnances as getPatientsModel } from "../models/PatientsOrdModel.js";

export const getPatientsWithOrdonnances = async () => {
  const patients = await getPatientsModel();

  const patientsWithStatus = patients.map((patient) => {
    let statut_calcule = "actif"; 
    let ecart_jours = 0;

    if (patient.date_prochaine_prise) {
      const dateProchaine = new Date(patient.date_prochaine_prise);
      const dateActuelle = new Date();
      
      ecart_jours = Math.floor(
        (dateActuelle - dateProchaine) / (1000 * 60 * 60 * 24)
      );

      // Déterminer le statut selon l'écart
      if (ecart_jours > 180) {
        statut_calcule = "perdu de vue";
      } else if (ecart_jours > 0) {
        statut_calcule = "actif";
      } else {
        statut_calcule = "actif";
      }
    }

    return {
      patient_name: patient.patient_name,
      patient_surname: patient.patient_surname,
      numero_dossier: patient.numero_dossier,
      ordonnance_id: patient.ordonnance_id,
      nom_traitement: patient.nom_traitement,
      date_debut_traitement: patient.date_debut_traitement,
      date_prochaine_prise: patient.date_prochaine_prise,
      quantite_prescrite: patient.quantite_prescrite,
      statut: patient.statut,
      statut_calcule: statut_calcule,
      ecart_jours: ecart_jours > 0 ? ecart_jours : 0,
    };
  });

  return {
    success: true,
    patients: patientsWithStatus,
    total: patientsWithStatus.length,
  };
};