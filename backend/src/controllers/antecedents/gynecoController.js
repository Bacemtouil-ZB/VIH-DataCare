//cheked 15/04/2026
import { fetchGyneco, addGyneco, editGyneco } from "../../services/antecedents/gynecoService.js";
import { logAction } from "../../services/auditService.js";

export const getGynecoController = async (req, res) => {
  try {
    const numero = req.params.patientId;
    const data = await fetchGyneco(numero);

    await logAction(req, {
      module: "ANTECEDENT_GYNECO",
      action: "ANTECEDENT_GYNECO_VIEW",
      patient_id: data?.patient_id || null,
      entity_id: data?.id || null,
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
    const numero = req.params.patientId;
    const data = await addGyneco(numero, req.body, userId);

    await logAction(req, {
      module: "ANTECEDENT_GYNECO",
      action: "ANTECEDENT_GYNECO_CREATE",
      patient_id: data?.patient_id || null,
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
    const numero = req.params.patientId;

    const old_data = await fetchGyneco(numero); // fetch AVANT

    const data = await editGyneco(numero, req.body, userId);

    await logAction(req, {
      module: "ANTECEDENT_GYNECO",
      action: "ANTECEDENT_GYNECO_UPDATE",
      patient_id: data?.patient_id || null,
      entity_id: data?.id || null,
      old_data: old_data,
      new_data: data,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur mise à jour antécédent gynécologique" });
  }
};