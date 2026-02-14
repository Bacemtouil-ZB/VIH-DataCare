import { getPatientsWithOrdonnances as getPatientsModel } from "../models/PatientsOrdModel.js";

export const getPatientsWithOrdonnances = async () => {
  const patients = await getPatientsModel();

  // Calcul du statut pour chaque patient
  const patientsWithStatus = patients.map((patient) => {
    let statut_calcule = patient.statut || "inconnu";
    let ecart_jours = 0;

    if (patient.date_prochaine_prise) {
      const dateProchaine = new Date(patient.date_prochaine_prise);
      const dateActuelle = new Date();
      
      // Calculer l'écart en jours
      ecart_jours = Math.floor(
        (dateActuelle - dateProchaine) / (1000 * 60 * 60 * 24)
      );

      // Déterminer le statut selon l'écart
      if (ecart_jours > 180) {
        // Plus de 6 mois de retard
        statut_calcule = "perdu de vue";
      } else if (ecart_jours > 30) {
        // Plus de 30 jours de retard
        statut_calcule = "en retard";
      } else if (ecart_jours > 0) {
        // Léger retard (1-30 jours)
        statut_calcule = "retard léger";
      } else if (ecart_jours >= -7) {
        // À venir dans les 7 jours
        statut_calcule = "à venir";
      } else {
        // En cours de suivi
        statut_calcule = "en cours";
      }
    }

    return {
      patient_name: patient.patient_name,
      patient_surname: patient.patient_surname,
      ordonnance_id: patient.ordonnance_id,
      nom_traitement: patient.nom_traitement,
      date_debut_traitement: patient.date_debut_traitement,
      date_prochaine_prise: patient.date_prochaine_prise,
      quantite_prescrite: patient.quantite_prescrite,
      statut: patient.statut,
      statut_calcule: statut_calcule,
      ecart_jours: ecart_jours,
    };
  });

  return {
    success: true,
    patients: patientsWithStatus,
    total: patientsWithStatus.length,
  };
};