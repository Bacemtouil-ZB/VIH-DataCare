//cheked 15/04/2026
import { fetchGyneco, addGyneco, editGyneco } from "../../services/antecedents/gynecoService.js";
import { logAction } from "../../services/auditService.js";

export const getGynecoController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const data = await fetchGyneco(patientId);
    
    await logAction(req, {
      module: "GYNECO_ANTECEDENT",
      action: "GYNECO_ANTECEDENT_VIEW",
      patient_id: patientId,
      entity_id: data?.[0]?.id || null,
      old_data: null,
      new_data: null,
    });
    
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
    
    await logAction(req, {
      module: "GYNECO_ANTECEDENT",
      action: "GYNECO_ANTECEDENT_CREATE",
      patient_id: patientId,
      entity_id: data?.id || null,
      old_data: null,
      new_data: data,
    });
    
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
    
    await logAction(req, {
      module: "GYNECO_ANTECEDENT",
      action: "GYNECO_ANTECEDENT_UPDATE",
      patient_id: patientId,
      entity_id: data?.id || null,
      old_data: null,
      new_data: data,
    });
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur mise à jour antécédent gynécologique" });
  }
};