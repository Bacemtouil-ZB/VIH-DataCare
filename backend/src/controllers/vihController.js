import {
  createVih as createVihService,
  getVihById as getVihByIdService,
  getVihByNumeroDossier as getVihByNumeroDossierService,
  updateVih as updateVihService,
} from "../services/vihService.js";
import { logAction } from "../services/auditService.js";

export const createVihController = async (req, res) => {
  try {
    const vihData = req.body;
    const userId = req.user.id;
    const vih = await createVihService(vihData, userId);

    await logAction(req, {
      module: "VIH",
      action: "VIH_CREATE",
      patient_id: vih.patient_id,
      entity_id: vih.id,
      old_data: null,
      new_data: vih,
    });

    res.status(201).json({
      success: true,
      message: "Dossier VIH créé avec succès",
      vih,
    });
  } catch (error) {
    console.error("Create VIH error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVihController = async (req, res) => {
  try {
    const { id } = req.params;
    const vih = await getVihByIdService(parseInt(id));

    await logAction(req, {
      module: "VIH",
      action: "VIH_VIEW",
      patient_id: vih.patient_id,
      entity_id: vih.id,
      old_data: null,
      new_data: null,
    });

    res.status(200).json({
      success: true,
      vih,
    });
  } catch (error) {
    console.error("Get VIH error:", error.message);
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVihByNumeroDossierController = async (req, res) => {
  try {
    const { numero } = req.params;
    const vih = await getVihByNumeroDossierService(numero);

    await logAction(req, {
      module: "VIH",
      action: "VIH_VIEW",
      patient_id: vih.patient_id,
      entity_id: vih.id,
      old_data: null,
      new_data: null,
    });

    res.status(200).json({
      success: true,
      vih,
    });
  } catch (error) {
    console.error("Get VIH by numero dossier error:", error.message);
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateVihController = async (req, res) => {
  try {
    const { id } = req.params;
    const vihData = req.body;
    const userId = req.user.id;

    const oldVih = await getVihByIdService(parseInt(id));
    const vih = await updateVihService(parseInt(id), vihData, userId);

    await logAction(req, {
      module: "VIH",
      action: "VIH_UPDATE",
      patient_id: vih.patient_id,
      entity_id: vih.id,
      old_data: oldVih,
      new_data: vih,
    });

    res.status(200).json({
      success: true,
      message: "Dossier VIH mis à jour avec succès",
      vih,
    });
  } catch (error) {
    console.error("Update VIH error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
