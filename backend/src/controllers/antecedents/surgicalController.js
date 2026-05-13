import { fetchSurgical, addSurgical, editSurgical, removeSurgical } from "../../services/antecedents/surgicalService.js";
import { logAction } from "../../services/auditService.js";

export const getSurgicalController = async (req, res) => {
  try {
    const numero = req.params.patientId;
    const data = await fetchSurgical(numero);

    await logAction(req, {
      module: "ANTECEDENT_CHIRURGICAL",
      action: "ANTECEDENT_CHIRURGICAL_VIEW",
      patient_id: null,
      entity_id: null,
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
    const numero = req.params.patientId;
    const data = await addSurgical(numero, req.body, userId);

    await logAction(req, {
      module: "ANTECEDENT_CHIRURGICAL",
      action: "ANTECEDENT_CHIRURGICAL_CREATE",
      patient_id: data?.patient_id || null,
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

    const old_data = await fetchSurgical(id); // fetch AVANT

    const data = await editSurgical(id, req.body);

    await logAction(req, {
      module: "ANTECEDENT_CHIRURGICAL",
      action: "ANTECEDENT_CHIRURGICAL_UPDATE",
      patient_id: data?.patient_id || null,
      entity_id: data?.id || null,
      old_data: old_data,
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

    const old_data = await fetchSurgical(id); // fetch AVANT suppression

    await removeSurgical(id);

    await logAction(req, {
      module: "ANTECEDENT_CHIRURGICAL",
      action: "ANTECEDENT_CHIRURGICAL_DELETE",
      patient_id: old_data?.patient_id || null, // traçabilité patient
      entity_id: parseInt(id),
      old_data: old_data,
      new_data: null,
    });

    res.status(200).json({ message: "Antécédent chirurgical supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur suppression antécédent chirurgical" });
  }
};