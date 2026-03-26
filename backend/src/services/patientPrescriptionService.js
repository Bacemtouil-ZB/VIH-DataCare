import { getPatientsWithPrescriptions as getPatientsModel } from "../models/patientPrescriptionModel.js";
import { SuiviTherapeutique } from "./suiviTherapeutique/SuiviTherapeutique.js";
import { upsertSuiviTherapeutique } from "../models/prescriptionWorkflowModel.js";

export const getPatientsWithPrescriptions = async () => {
  const patients = await getPatientsModel();
  const patientsWithStatus = [];

  for (const patient of patients) {
    const isDelivree = (patient.statut_prescription || "").toLowerCase() === "delivree";
    let suiviData = {
      statut_patient: "en attente",
      ecart_jours: 0,
      date_ecart: 0,
    };

    if (isDelivree) {
      const computed = new SuiviTherapeutique(patient.date_prochaine_prise).toJSON();
      const ecartFromDb = Number.parseInt(patient.suivi_date_ecart || 0, 10);
      suiviData = {
        statut_patient: patient.statut_patient || computed.statut_patient,
        ecart_jours: ecartFromDb > 0 ? ecartFromDb : computed.ecart_jours,
        date_ecart: ecartFromDb > 0 ? ecartFromDb : computed.date_ecart,
      };

      if (patient.prescription_id && patient.patient_id) {
        await upsertSuiviTherapeutique({
          prescriptionId: patient.prescription_id,
          patientId: patient.patient_id,
          statutPatient: suiviData.statut_patient,
          dateProchainePrise: patient.date_prochaine_prise,
          dateEcart: suiviData.date_ecart,
        });
      }
    }

    patientsWithStatus.push({
      patient_name: patient.patient_name,
      patient_surname: patient.patient_surname,
      numero_dossier: patient.numero_dossier,
      prescription_id: patient.prescription_id,
      nom_traitement: patient.nom_traitement,
      date_debut_traitement: patient.date_debut_traitement,
      date_prochaine_prise: patient.date_prochaine_prise,
      date_delivrance: patient.date_delivrance,
      quantite_prescrite: patient.quantite_prescrite,
      statut: suiviData.statut_patient,
      statut_prescription: patient.statut_prescription || "envoyee",
      statut_patient: suiviData.statut_patient,
      statut_calcule: suiviData.statut_patient,
      ecart_jours: suiviData.ecart_jours > 0 ? suiviData.ecart_jours : 0,
      date_ecart: suiviData.date_ecart,
    });
  }

  return {
    success: true,
    patients: patientsWithStatus,
    total: patientsWithStatus.length,
  };
};
