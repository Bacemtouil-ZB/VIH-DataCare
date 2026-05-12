//cheked 15/04/2026
import {
  fetchHabitudesVie,
  addHabitudesVie,
  editHabitudesVie,
} from "../../services/antecedents/habitudesVieService.js";
import { logAction } from "../../services/auditService.js";

export const getHabitudesVieController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const data = await fetchHabitudesVie(patientId);
    
    await logAction(req, {
      module: "HABITUDES_VIE_ANTECEDENT",
      action: "HABITUDES_VIE_ANTECEDENT_VIEW",
      patient_id: patientId,
      entity_id: data?.[0]?.id || null,
      old_data: null,
      new_data: null,
    });
    
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
    
    await logAction(req, {
      module: "HABITUDES_VIE_ANTECEDENT",
      action: "HABITUDES_VIE_ANTECEDENT_CREATE",
      patient_id: patientId,
      entity_id: data?.id || null,
      old_data: null,
      new_data: data,
    });
    
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
    
    await logAction(req, {
      module: "HABITUDES_VIE_ANTECEDENT",
      action: "HABITUDES_VIE_ANTECEDENT_UPDATE",
      patient_id: patientId,
      entity_id: data?.id || null,
      old_data: null,
      new_data: data,
    });
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur mise à jour habitudes de vie" });
  }
};