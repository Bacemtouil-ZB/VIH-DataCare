//cheked 15/04/2026
import { fetchTransfusion, addTransfusion, editTransfusion, removeTransfusion } from "../../services/antecedents/transfusionService.js";
import { logAction } from "../../services/auditService.js";

export const getTransfusionController = async (req, res) => {
  try {
    const numero = req.params.patientId;
    const data = await fetchTransfusion(numero);

    await logAction(req, {
      module: "ANTECEDENT_TRANSFUSION",
      action: "ANTECEDENT_TRANSFUSION_VIEW",
      patient_id: null,
      entity_id: null,
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
    const numero = req.params.patientId;
    const data = await addTransfusion(numero, req.body, userId);

    await logAction(req, {
      module: "ANTECEDENT_TRANSFUSION",
      action: "ANTECEDENT_TRANSFUSION_CREATE",
      patient_id: data?.patient_id || null,
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

    const old_data = await fetchTransfusion(id); // fetch AVANT

    const data = await editTransfusion(id, req.body);

    await logAction(req, {
      module: "ANTECEDENT_TRANSFUSION",
      action: "ANTECEDENT_TRANSFUSION_UPDATE",
      patient_id: data?.patient_id || null,
      entity_id: data?.id || null,
      old_data: old_data,
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

    const old_data = await fetchTransfusion(id); // fetch AVANT suppression

    await removeTransfusion(id);

    await logAction(req, {
      module: "ANTECEDENT_TRANSFUSION",
      action: "ANTECEDENT_TRANSFUSION_DELETE",
      patient_id: old_data?.patient_id || null,
      entity_id: parseInt(id),
      old_data: old_data,
      new_data: null,
    });

    res.status(200).json({ message: "Antécédent transfusion supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur suppression antécédent transfusion" });
  }
};