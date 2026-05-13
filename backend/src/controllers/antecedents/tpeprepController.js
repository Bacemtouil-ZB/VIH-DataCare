//cheked 15/04/2026
import { fetchTpePrep, addTpePrep, editTpePrep, removeTpePrep } from "../../services/antecedents/tpePrepService.js";
import { logAction } from "../../services/auditService.js";

export const getTpePrepController = async (req, res) => {
  try {
    const numero = req.params.patientId;
    const data = await fetchTpePrep(numero);

    await logAction(req, {
      module: "ANTECEDENT_TPE_PREP",
      action: "ANTECEDENT_TPE_PREP_VIEW",
      patient_id: null,
      entity_id: null,
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
    const numero = req.params.patientId;
    const data = await addTpePrep(numero, req.body, userId);

    await logAction(req, {
      module: "ANTECEDENT_TPE_PREP",
      action: "ANTECEDENT_TPE_PREP_CREATE",
      patient_id: data?.patient_id || null,
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

    const old_data = await fetchTpePrep(id); // fetch AVANT

    const data = await editTpePrep(id, req.body);

    await logAction(req, {
      module: "ANTECEDENT_TPE_PREP",
      action: "ANTECEDENT_TPE_PREP_UPDATE",
      patient_id: data?.patient_id || null,
      entity_id: data?.id || null,
      old_data: old_data,
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

    const old_data = await fetchTpePrep(id); // fetch AVANT suppression

    await removeTpePrep(id);

    await logAction(req, {
      module: "ANTECEDENT_TPE_PREP",
      action: "ANTECEDENT_TPE_PREP_DELETE",
      patient_id: old_data?.patient_id || null,
      entity_id: parseInt(id),
      old_data: old_data,
      new_data: null,
    });

    res.status(200).json({ message: "Antécédent TPE/PrEP supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur suppression antécédent TPE/PrEP" });
  }
};