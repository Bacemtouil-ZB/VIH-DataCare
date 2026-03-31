import { fetchMedical, addMedical, editMedical } from "../../services/antecedents/medicalService.js";

export const getMedicalController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const data = await fetchMedical(patientId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur récupération antécédent médical" });
  }
};

export const createMedicalController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { patientId } = req.params;
    const data = await addMedical(patientId, req.body, userId);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur création antécédent médical" });
  }
};

export const updateMedicalController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { patientId } = req.params;
    const data = await editMedical(patientId, req.body, userId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur mise à jour antécédent médical" });
  }
};