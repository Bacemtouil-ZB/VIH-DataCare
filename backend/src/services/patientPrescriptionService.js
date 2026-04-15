import { getPatientsWithPrescriptions as getPatientsModel } from "../models/patientPrescriptionModel.js";

export const getPatientsWithPrescriptions = async () => {
  const patients = await getPatientsModel();

  const patientsWithStatus = patients.map((patient) => ({
    patient_id:            patient.patient_id,
    patient_name:          patient.patient_name,
    patient_surname:       patient.patient_surname,
    numero_dossier:        patient.numero_dossier,
    date_naissance:        patient.date_naissance,
    prescription_id:       patient.prescription_id,
    nom_traitement:        patient.nom_traitement ?? "Aucun",
    posologie:             patient.posologie ?? null,
    remarque:              patient.remarque ?? null,

    // Périodes
    periode:               Number(patient.periode_effective ?? 0),  // période retenue (j)
    periode_prescrite:     patient.periode_prescrite,                // originale médecin
    periode_modifiee:      patient.periode_modifiee,                 // pharmacien (null si scénario 1)

    // Dates
    date_debut_traitement: patient.date_debut_traitement,
    date_prochaine_prise:  patient.date_prochaine_prise,
    date_delivrance:       patient.date_delivrance,

    // Statuts — directement depuis la base, aucun calcul JS
    statut_prescription:   patient.statut_prescription || "envoyee",
    statut_patient:        patient.statut_patient      || "en attente",
    ecart_jours:           Number(patient.ecart_jours  ?? 0),
  }));

  return {
    success: true,
    patients: patientsWithStatus,
    total:    patientsWithStatus.length,
  };
};