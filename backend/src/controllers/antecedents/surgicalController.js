//cheked 15/04/2026
import { fetchSurgical, addSurgical, editSurgical, removeSurgical } from "../../services/antecedents/surgicalService.js";
import { logAction } from "../../services/auditService.js";

export const getSurgicalController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const data = await fetchSurgical(patientId);
    
    await logAction(req, {
      module: "SURGICAL_ANTECEDENT",
      action: "SURGICAL_ANTECEDENT_VIEW",
      patient_id: patientId,
      entity_id: data?.[0]?.id || null,
      old_data: null,
      new_data: null,
    });
    
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
    
    await logAction(req, {
      module: "SURGICAL_ANTECEDENT",
      action: "SURGICAL_ANTECEDENT_CREATE",
      patient_id: patientId,
      entity_id: data?.id || null,
      old_data: null,
      new_data: data,
    });
    
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur création antécédent chirurgical" });
  }
};

export const updateSurgicalController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await editSurgical(id, req.body);
    
    await logAction(req, {
      module: "SURGICAL_ANTECEDENT",
      action: "SURGICAL_ANTECEDENT_UPDATE",
      patient_id: data?.patient_id || null,
      entity_id: data?.id || null,
      old_data: null,
      new_data: data,
    });
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur mise à jour antécédent chirurgical" });
  }
};

export const deleteSurgicalController = async (req, res) => {
  try {
    const { id } = req.params;
    await removeSurgical(id);
    
    await logAction(req, {
      module: "SURGICAL_ANTECEDENT",
      action: "SURGICAL_ANTECEDENT_DELETE",
      patient_id: null,
      entity_id: id,
      old_data: null,
      new_data: null,
    });
    
    res.status(200).json({ message: "Antécédent chirurgical supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur suppression antécédent chirurgical" });
  }
};