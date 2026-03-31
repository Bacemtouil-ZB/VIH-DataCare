import { fetchTransfusion, addTransfusion, editTransfusion, removeTransfusion } from "../../services/antecedents/transfusionService.js";

export const getTransfusionController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const data = await fetchTransfusion(patientId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur récupération antécédents transfusions" });
  }
};

export const createTransfusionController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { patientId } = req.params;
    const data = await addTransfusion(patientId, req.body, userId);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur création antécédent transfusion" });
  }
};

export const updateTransfusionController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await editTransfusion(id, req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur mise à jour antécédent transfusion" });
  }
};

export const deleteTransfusionController = async (req, res) => {
  try {
    const { id } = req.params;
    await removeTransfusion(id);
    res.status(200).json({ message: "Antécédent transfusion supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur suppression antécédent transfusion" });
  }
};