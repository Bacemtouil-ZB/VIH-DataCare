import {
  fetchHabitudesVie,
  addHabitudesVie,
  editHabitudesVie,
} from "../../services/antecedents/habitudesVieService.js";

export const getHabitudesVieController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const data = await fetchHabitudesVie(patientId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur récupération habitudes de vie" });
  }
};

export const createHabitudesVieController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { patientId } = req.params;
    const data = await addHabitudesVie(patientId, req.body, userId);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur création habitudes de vie" });
  }
};

export const updateHabitudesVieController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { patientId } = req.params;
    const data = await editHabitudesVie(patientId, req.body, userId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur mise à jour habitudes de vie" });
  }
};