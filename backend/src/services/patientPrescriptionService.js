import { getPatientsWithPrescriptions as getPatientsModel } from "../models/patientPrescriptionModel.js";
import { SuiviTherapeutique } from "./suiviTherapeutique/SuiviTherapeutique.js";

export const getPatientsWithPrescriptions = async () => {
  const patients = await getPatientsModel();
  const patientsWithStatus = [];

  for (const patient of patients) {
    const statut     = (patient.statut_prescription || "").toLowerCase();
    const isDelivree = statut === "delivree" || statut === "modifie";

    // ── Période effective ─────────────────────────────────────────────────────
    // Scénario 2 : le pharmacien a modifié → on utilise periode_modifiee
    // Scénario 1 : validation sans modification → on utilise periode_prescrite
    const periodeEffective =
      patient.periode_modifiee != null && Number(patient.periode_modifiee) > 0
        ? Number(patient.periode_modifiee)
        : Number(patient.periode_prescrite ?? 0);

    let suiviData = {
      statut_patient: "en attente",
      ecart_jours:    0,
      date_ecart:     0,
    };

    if (isDelivree) {
      // date_prochaine_prise stockée en base (calculée lors de la validation SQL)
      // On recalcule côté JS uniquement si absente en base (sécurité)
      let dateProchainePrise = patient.date_prochaine_prise;

      if (!dateProchainePrise && patient.date_delivrance && periodeEffective > 0) {
        dateProchainePrise = SuiviTherapeutique.calculerDateProchainePrise(
          patient.date_delivrance,
          periodeEffective,
        );
      }

      const computed     = new SuiviTherapeutique(dateProchainePrise).toJSON();
      const ecartFromDb  = Number.parseInt(patient.suivi_date_ecart || 0, 10);

      suiviData = {
        statut_patient: patient.statut_patient || computed.statut_patient,
        ecart_jours:    ecartFromDb > 0 ? ecartFromDb : computed.ecart_jours,
        date_ecart:     ecartFromDb > 0 ? ecartFromDb : computed.date_ecart,
      };
    }

    patientsWithStatus.push({
      patient_id:            patient.patient_id,
      patient_name:          patient.patient_name,
      patient_surname:       patient.patient_surname,
      numero_dossier:        patient.numero_dossier,
      date_naissance:        patient.date_naissance,
      prescription_id:       patient.prescription_id,
      nom_traitement:        patient.nom_traitement ?? "Aucun",
      posologie:             patient.posologie ?? null,
      // Périodes
      periode:               periodeEffective,          // période retenue (j)
      periode_prescrite:     patient.periode_prescrite, // originale médecin
      periode_modifiee:      patient.periode_modifiee,  // modifiée pharmacien (null si scénario 1)
      // Dates
      date_debut_traitement: patient.date_debut_traitement,
      date_prochaine_prise:  patient.date_prochaine_prise,
      date_delivrance:       patient.date_delivrance,
      // Statuts
      statut_prescription:   patient.statut_prescription || "envoyee",
      statut_patient:        suiviData.statut_patient,
      ecart_jours:           suiviData.ecart_jours > 0 ? suiviData.ecart_jours : 0,
      date_ecart:            suiviData.date_ecart,
    });
  }

  return {
    success: true,
    patients: patientsWithStatus,
    total:    patientsWithStatus.length,
  };
};