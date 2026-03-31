import { fetchGyneco, addGyneco, editGyneco } from "../../services/antecedents/gynecoService.js";

export const getGynecoController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const data = await fetchGyneco(patientId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur récupération antécédent gynécologique" });
  }
};

export const createGynecoController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { patientId } = req.params;
    const data = await addGyneco(patientId, req.body, userId);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur création antécédent gynécologique" });
  }
};

export const updateGynecoController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { patientId } = req.params;
    const data = await editGyneco(patientId, req.body, userId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur mise à jour antécédent gynécologique" });
  }
};