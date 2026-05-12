//cheked 15/04/2026
import { fetchFamily, addFamily, editFamily } from "../../services/antecedents/familyService.js";
import { logAction } from "../../services/auditService.js";

export const getFamilyController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const data = await fetchFamily(patientId);
    
    await logAction(req, {
      module: "FAMILY_ANTECEDENT",
      action: "FAMILY_ANTECEDENT_VIEW",
      patient_id: patientId,
      entity_id: data?.[0]?.id || null,
      old_data: null,
      new_data: null,
    });
    
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
    
    await logAction(req, {
      module: "FAMILY_ANTECEDENT",
      action: "FAMILY_ANTECEDENT_CREATE",
      patient_id: patientId,
      entity_id: data?.id || null,
      old_data: null,
      new_data: data,
    });
    
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
    
    await logAction(req, {
      module: "FAMILY_ANTECEDENT",
      action: "FAMILY_ANTECEDENT_UPDATE",
      patient_id: patientId,
      entity_id: data?.id || null,
      old_data: null,
      new_data: data,
    });
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur mise à jour antécédent familial" });
  }
};