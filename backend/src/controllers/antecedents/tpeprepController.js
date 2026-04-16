//cheked 15/04/2026
import { fetchTpePrep, addTpePrep, editTpePrep, removeTpePrep } from "../../services/antecedents/tpePrepService.js";

export const getTpePrepController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const data = await fetchTpePrep(patientId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur récupération antécédents TPE/PrEP" });
  }
};

export const createTpePrepController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { patientId } = req.params;
    const data = await addTpePrep(patientId, req.body, userId);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur création antécédent TPE/PrEP" });
  }
};

export const updateTpePrepController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await editTpePrep(id, req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur mise à jour antécédent TPE/PrEP" });
  }
};

export const deleteTpePrepController = async (req, res) => {
  try {
    const { id } = req.params;
    await removeTpePrep(id);
    res.status(200).json({ message: "Antécédent TPE/PrEP supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur suppression antécédent TPE/PrEP" });
  }
};