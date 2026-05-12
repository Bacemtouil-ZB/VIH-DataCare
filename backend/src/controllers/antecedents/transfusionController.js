//cheked 15/04/2026
import { fetchTransfusion, addTransfusion, editTransfusion, removeTransfusion } from "../../services/antecedents/transfusionService.js";
import { logAction } from "../../services/auditService.js";

export const getTransfusionController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const data = await fetchTransfusion(patientId);
    
    await logAction(req, {
      module: "TRANSFUSION_ANTECEDENT",
      action: "TRANSFUSION_ANTECEDENT_VIEW",
      patient_id: patientId,
      entity_id: data?.[0]?.id || null,
      old_data: null,
      new_data: null,
    });
    
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
    
    await logAction(req, {
      module: "TRANSFUSION_ANTECEDENT",
      action: "TRANSFUSION_ANTECEDENT_CREATE",
      patient_id: patientId,
      entity_id: data?.id || null,
      old_data: null,
      new_data: data,
    });
    
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur création antécédent transfusion" });
  }
};

export const updateTransfusionController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await editTransfusion(id, req.body);
    
    await logAction(req, {
      module: "TRANSFUSION_ANTECEDENT",
      action: "TRANSFUSION_ANTECEDENT_UPDATE",
      patient_id: data?.patient_id || null,
      entity_id: data?.id || null,
      old_data: null,
      new_data: data,
    });
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur mise à jour antécédent transfusion" });
  }
};

export const deleteTransfusionController = async (req, res) => {
  try {
    const { id } = req.params;
    await removeTransfusion(id);
    
    await logAction(req, {
      module: "TRANSFUSION_ANTECEDENT",
      action: "TRANSFUSION_ANTECEDENT_DELETE",
      patient_id: null,
      entity_id: id,
      old_data: null,
      new_data: null,
    });
    
    res.status(200).json({ message: "Antécédent transfusion supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur suppression antécédent transfusion" });
  }
};