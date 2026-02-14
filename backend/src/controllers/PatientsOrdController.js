import { getPatientsWithOrdonnances } from "../services/PatientsOrdService.js";

export const getPatientsWithOrdonnancesController = async (req, res) => {
  try {
    const result = await getPatientsWithOrdonnances();
    
    res.status(200).json({
      success: true,
      patients: result.patients,
      total: result.total,
    });
  } catch (error) {
    console.error("Erreur getPatientsWithOrdonnances:", error.message);
    
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des ordonnances",
      error: error.message,
    });
  }
};