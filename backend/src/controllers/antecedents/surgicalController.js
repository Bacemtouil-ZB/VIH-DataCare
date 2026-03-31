import { fetchSurgical, addSurgical, editSurgical, removeSurgical } from "../../services/antecedents/surgicalService.js";

export const getSurgicalController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const data = await fetchSurgical(patientId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur récupération antécédents chirurgicaux" });
  }
};

export const createSurgicalController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { patientId } = req.params;
    const data = await addSurgical(patientId, req.body, userId);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur création antécédent chirurgical" });
  }
};

export const updateSurgicalController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await editSurgical(id, req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur mise à jour antécédent chirurgical" });
  }
};

export const deleteSurgicalController = async (req, res) => {
  try {
    const { id } = req.params;
    await removeSurgical(id);
    res.status(200).json({ message: "Antécédent chirurgical supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur suppression antécédent chirurgical" });
  }
};