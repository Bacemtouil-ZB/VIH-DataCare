//cheked 15/04/2026
import { fetchTherapeutic, addTherapeutic, editTherapeutic } from "../../services/antecedents/therapeuticService.js";

export const getTherapeuticController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const data = await fetchTherapeutic(patientId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur récupération antécédent thérapeutique" });
  }
};

export const createTherapeuticController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { patientId } = req.params;
    const data = await addTherapeutic(patientId, req.body, userId);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur création antécédent thérapeutique" });
  }
};

export const updateTherapeuticController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { patientId } = req.params;
    const data = await editTherapeutic(patientId, req.body, userId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur mise à jour antécédent thérapeutique" });
  }
};