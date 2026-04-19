import { getPatientsWithPrescriptions as getPatientsModel } from "../models/patientPrescriptionModel.js";

export const getPatientsWithPrescriptions = async () => {
  const patients = await getPatientsModel();

  const patientsWithStatus = patients.map((patient) => ({
    patient_id:             patient.patient_id,
    patient_name:           patient.patient_name,
    patient_surname:        patient.patient_surname,
    numero_dossier:         patient.numero_dossier,
    date_naissance:         patient.date_naissance,
    prescription_id:        patient.prescription_id,
    nom_traitement:         patient.nom_traitement        ?? "Aucun",
    posologie:              patient.posologie              ?? null,
    remarque:               patient.remarque               ?? null,

    // Périodes
    periode:                Number(patient.periode_effective ?? 0),
    periode_prescrite:      patient.periode_prescrite,
    periode_modifiee:       patient.periode_modifiee,

    // Dates
    date_debut_traitement:  patient.date_debut_traitement,
    date_prochaine_prise:   patient.date_prochaine_prise,
    date_delivrance:        patient.date_delivrance,

    // Statuts — depuis patients.status (vérité aujourd'hui)
    statut_prescription:    patient.statut_prescription   || "envoyee",
    statut_patient:         patient.statut_patient        || "en_attente",

    // Suivi — depuis suivi_therapeutique
    suivi_statut_patient:   patient.suivi_statut_patient  || null,
    date_ecart:             Number(patient.date_ecart     ?? 0),
    alerte_contradiction:   patient.alerte_contradiction  ?? false,
  }));

  return {
    success: true,
    patients: patientsWithStatus,
    total:    patientsWithStatus.length,
  };
};