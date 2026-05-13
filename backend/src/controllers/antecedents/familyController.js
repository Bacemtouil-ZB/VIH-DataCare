import { fetchFamily, addFamily, editFamily } from "../../services/antecedents/familyService.js";
import { logAction } from "../../services/auditService.js";

export const getFamilyController = async (req, res) => {
  try {
    const numero = req.params.patientId; // PAS de parseInt — c'est un numero string
    const data = await fetchFamily(numero);

    await logAction(req, {
      module: "ANTECEDENT_FAMILIAL",
      action: "ANTECEDENT_FAMILIAL_VIEW",
      patient_id: null, 
      entity_id: data?.id || null,
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
    const numero = req.params.patientId; // PAS de parseInt

    const data = await addFamily(numero, req.body, userId);

    await logAction(req, {
      module: "ANTECEDENT_FAMILIAL",
      action: "ANTECEDENT_FAMILIAL_CREATE",
      patient_id: data?.patient_id || null,
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
    const numero = req.params.patientId; // PAS de parseInt

    // Fetch old_data AVANT modification
    const old_data = await fetchFamily(numero);

    const data = await editFamily(numero, req.body, userId);

    await logAction(req, {
      module: "ANTECEDENT_FAMILIAL",
      action: "ANTECEDENT_FAMILIAL_UPDATE",
      patient_id: data?.patient_id || null,
      entity_id: data?.id || null,
      old_data: old_data,
      new_data: data,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur mise à jour antécédent familial" });
  }
};