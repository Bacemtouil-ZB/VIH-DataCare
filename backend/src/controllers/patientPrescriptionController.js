import { getPatientsWithPrescriptions } from "../services/patientPrescriptionService.js";

export const getPatientsWithPrescriptionsController = async (_req, res) => {
  try {
    const result = await getPatientsWithPrescriptions();

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
