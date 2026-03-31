import { fetchFamily, addFamily, editFamily } from "../../services/antecedents/familyService.js";

export const getFamilyController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const data = await fetchFamily(patientId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur récupération antécédent familial" });
  }
};

export const createFamilyController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { patientId } = req.params;
    const data = await addFamily(patientId, req.body, userId);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur création antécédent familial" });
  }
};

export const updateFamilyController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { patientId } = req.params;
    const data = await editFamily(patientId, req.body, userId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur mise à jour antécédent familial" });
  }
};