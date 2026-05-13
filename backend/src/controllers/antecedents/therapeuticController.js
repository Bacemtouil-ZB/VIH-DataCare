//cheked 15/04/2026
import { fetchTherapeutic, addTherapeutic, editTherapeutic } from "../../services/antecedents/therapeuticService.js";
import { logAction } from "../../services/auditService.js";

export const getTherapeuticController = async (req, res) => {
  try {
    const numero = req.params.patientId;
    const data = await fetchTherapeutic(numero);

    await logAction(req, {
      module: "ANTECEDENT_THERAPEUTIQUE",
      action: "ANTECEDENT_THERAPEUTIQUE_VIEW",
      patient_id: data?.patient_id || null,
      entity_id: data?.id || null,
      old_data: null,
      new_data: null,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur récupération antécédent thérapeutique" });
  }
};

export const createTherapeuticController = async (req, res) => {
  try {
    const userId = req.user.id;
    const numero = req.params.patientId;
    const data = await addTherapeutic(numero, req.body, userId);

    await logAction(req, {
      module: "ANTECEDENT_THERAPEUTIQUE",
      action: "ANTECEDENT_THERAPEUTIQUE_CREATE",
      patient_id: data?.patient_id || null,
      entity_id: data?.id || null,
      old_data: null,
      new_data: data,
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur création antécédent thérapeutique" });
  }
};

export const updateTherapeuticController = async (req, res) => {
  try {
    const userId = req.user.id;
    const numero = req.params.patientId;

    const old_data = await fetchTherapeutic(numero); // fetch AVANT

    const data = await editTherapeutic(numero, req.body, userId);

    await logAction(req, {
      module: "ANTECEDENT_THERAPEUTIQUE",
      action: "ANTECEDENT_THERAPEUTIQUE_UPDATE",
      patient_id: data?.patient_id || null,
      entity_id: data?.id || null,
      old_data: old_data,
      new_data: data,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur mise à jour antécédent thérapeutique" });
  }
};