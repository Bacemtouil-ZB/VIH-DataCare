//cheked 15/04/2026
import {
  fetchHabitudesVie,
  addHabitudesVie,
  editHabitudesVie,
} from "../../services/antecedents/habitudesVieService.js";
import { logAction } from "../../services/auditService.js";

export const getHabitudesVieController = async (req, res) => {
  try {
    const numero = req.params.patientId;
    const data = await fetchHabitudesVie(numero);

    await logAction(req, {
      module: "HABITUDE_DE_VIE",
      action: "HABITUDE_DE_VIE_VIEW",        
      patient_id: data?.patient_id || null,
      entity_id: data?.id || null,
      old_data: null,
      new_data: null,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur récupération habitudes de vie" });
  }
};

export const createHabitudesVieController = async (req, res) => {
  try {
    const userId = req.user.id;
    const numero = req.params.patientId;
    const data = await addHabitudesVie(numero, req.body, userId);

    await logAction(req, {
      module: "HABITUDE_DE_VIE",
      action: "HABITUDE_DE_VIE_CREATE",     
      patient_id: data?.patient_id || null,
      entity_id: data?.id || null,
      old_data: null,
      new_data: data,
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur création habitudes de vie" });
  }
};

export const updateHabitudesVieController = async (req, res) => {
  try {
    const userId = req.user.id;
    const numero = req.params.patientId;

    const old_data = await fetchHabitudesVie(numero); // fetch AVANT

    const data = await editHabitudesVie(numero, req.body, userId);

    await logAction(req, {
      module: "HABITUDE_DE_VIE",
      action: "HABITUDE_DE_VIE_UPDATE",      
      patient_id: data?.patient_id || null,
      entity_id: data?.id || null,
      old_data: old_data,
      new_data: data,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur mise à jour habitudes de vie" });
  }
};