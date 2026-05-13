//cheked 15/04/2026
import { fetchTpePrep, addTpePrep, editTpePrep, removeTpePrep } from "../../services/antecedents/tpePrepService.js";
import { logAction } from "../../services/auditService.js";

export const getTpePrepController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const data = await fetchTpePrep(patientId);
    
    await logAction(req, {
      module: "TPE_PREP_ANTECEDENT",
      action: "TPE_PREP_ANTECEDENT_VIEW",
      patient_id: patientId,
      entity_id: data?.[0]?.id || null,
      old_data: null,
      new_data: null,
    });
    
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
    
    await logAction(req, {
      module: "TPE_PREP_ANTECEDENT",
      action: "TPE_PREP_ANTECEDENT_CREATE",
      patient_id: patientId,
      entity_id: data?.id || null,
      old_data: null,
      new_data: data,
    });
    
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur création antécédent TPE/PrEP" });
  }
};

export const updateTpePrepController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await editTpePrep(id, req.body);
    
    await logAction(req, {
      module: "TPE_PREP_ANTECEDENT",
      action: "TPE_PREP_ANTECEDENT_UPDATE",
      patient_id: data?.patient_id || null,
      entity_id: data?.id || null,
      old_data: null,
      new_data: data,
    });
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur mise à jour antécédent TPE/PrEP" });
  }
};

export const deleteTpePrepController = async (req, res) => {
  try {
    const { id } = req.params;
    await removeTpePrep(id);
    
    await logAction(req, {
      module: "TPE_PREP_ANTECEDENT",
      action: "TPE_PREP_ANTECEDENT_DELETE",
      patient_id: null,
      entity_id: id,
      old_data: null,
      new_data: null,
    });
    
    res.status(200).json({ message: "Antécédent TPE/PrEP supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur suppression antécédent TPE/PrEP" });
  }
};