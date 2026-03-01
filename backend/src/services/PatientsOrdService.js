import { getPatientsWithOrdonnances as getPatientsModel } from "../models/PatientsOrdModel.js";
import { calculerStatutOrdonnance } from "../utils/ordonnanceUtils.js";

export const getPatientsWithOrdonnances = async () => {
  const patients = await getPatientsModel();
  const patientsEnrichis = patients.map((patient) => {
    const { statut_calcule, jours_retard } = calculerStatutOrdonnance(
      patient.date_prochaine_prise
    );

    return {
      ...patient,
      statut_calcule,
      jours_retard,
    };
  });

  return {
    success: true,
    patients: patientsEnrichis,
    total: patientsEnrichis.length,
  };
};