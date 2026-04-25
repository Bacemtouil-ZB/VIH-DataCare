import { getPatientsWithPrescriptions } from "../services/patientPrescriptionService.js";
import { logAction } from "../services/auditService.js";

export const getPatientsWithPrescriptionsController = async (req, res) => {
  try {
    const result = await getPatientsWithPrescriptions();

    await logAction(req, {
      module: "PATIENT_PRESCRIPTION",
      action: "PATIENT_PRESCRIPTION_LIST_VIEW",
      entity_id: null,
      old_data: null,
      new_data: null,
    });

    res.status(200).json({
      success: true,
      patients: result.patients,
      total: result.total,
    });
  } catch (error) {
    console.error("Erreur getPatientsWithPrescriptions:", error.message);

    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des prescriptions médicales",
      error: error.message,
    });
  }
};
