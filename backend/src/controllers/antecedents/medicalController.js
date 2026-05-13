//cheked 15/04/2026
import { fetchMedical, addMedical, editMedical } from "../../services/antecedents/medicalService.js";
import { logAction } from "../../services/auditService.js";

export const getMedicalController = async (req, res) => {
  try {
    const numero = req.params.patientId;
    const data = await fetchMedical(numero);

    await logAction(req, {
      module: "ANTECEDENT_MEDICAL",
      action: "ANTECEDENT_MEDICAL_VIEW",
      patient_id: data?.patient_id || null,
      entity_id: data?.id || null,
      old_data: null,
      new_data: null,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur récupération antécédent médical" });
  }
};

export const createMedicalController = async (req, res) => {
  try {
    const userId = req.user.id;
    const numero = req.params.patientId;
    const data = await addMedical(numero, req.body, userId);

    await logAction(req, {
      module: "ANTECEDENT_MEDICAL",
      action: "ANTECEDENT_MEDICAL_CREATE",
      patient_id: data?.patient_id || null,
      entity_id: data?.id || null,
      old_data: null,
      new_data: data,
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur création antécédent médical" });
  }
};

export const updateMedicalController = async (req, res) => {
  try {
    const userId = req.user.id;
    const numero = req.params.patientId;

    const old_data = await fetchMedical(numero); // fetch AVANT

    const data = await editMedical(numero, req.body, userId);

    await logAction(req, {
      module: "ANTECEDENT_MEDICAL",
      action: "ANTECEDENT_MEDICAL_UPDATE",
      patient_id: data?.patient_id || null,
      entity_id: data?.id || null,
      old_data: old_data,
      new_data: data,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur mise à jour antécédent médical" });
  }
};