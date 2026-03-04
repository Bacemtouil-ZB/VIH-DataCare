import {
  createHabitudeDeVie as createHabitudeDeVieService,
  getHabitudeDeVieById as getHabitudeDeVieByIdService,
  getHabitudeDeVieByNumeroDossier as getHabitudeDeVieByNumeroDossierService,
  updateHabitudeDeVie as updateHabitudeDeVieService,
} from "../../services/examenClinique/habitudeDeVieService.js";
import { logAction } from "../../services/auditService.js";

export const createHabitudeDeVieController = async (req, res) => {
  try {
    const habitudeData = req.body;
    const userId = req.user.id;

    const habitude = await createHabitudeDeVieService(habitudeData, userId);

    await logAction(req, {
      module: "HABITUDE_DE_VIE",
      action: "HABITUDE_DE_VIE_CREATE",
      patient_id: habitude.patient_id,
      entity_id: habitude.id,
      old_data: null,
      new_data: habitude,
    });

    res.status(201).json({
      success: true,
      message: "Habitudes de vie creees avec succes",
      habitude,
    });
  } catch (error) {
    console.error("Create habitude error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHabitudeDeVieController = async (req, res) => {
  try {
    const { id } = req.params;
    const habitude = await getHabitudeDeVieByIdService(parseInt(id, 10));

    await logAction(req, {
      module: "HABITUDE_DE_VIE",
      action: "HABITUDE_DE_VIE_VIEW",
      patient_id: habitude.patient_id,
      entity_id: habitude.id,
      old_data: null,
      new_data: null,
    });

    res.status(200).json({
      success: true,
      habitude,
    });
  } catch (error) {
    console.error("Get habitude error:", error.message);
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHabitudeDeVieByNumeroDossierController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
    const habitudes = await getHabitudeDeVieByNumeroDossierService(numeroDossier);
    const firstHabitude = Array.isArray(habitudes) && habitudes.length > 0 ? habitudes[0] : null;

    await logAction(req, {
      module: "HABITUDE_DE_VIE",
      action: "HABITUDE_DE_VIE_VIEW",
      patient_id: firstHabitude?.patient_id ?? null,
      entity_id: firstHabitude?.id ?? null,
      old_data: null,
      new_data: null,
    });

    res.status(200).json({
      success: true,
      habitudes,
    });
  } catch (error) {
    console.error("Get habitude by numero error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateHabitudeDeVieController = async (req, res) => {
  try {
    const { id } = req.params;
    const habitudeData = req.body;
    const userId = req.user.id;

    const oldHabitude = await getHabitudeDeVieByIdService(parseInt(id, 10));
    const habitude = await updateHabitudeDeVieService(parseInt(id, 10), habitudeData, userId);

    await logAction(req, {
      module: "HABITUDE_DE_VIE",
      action: "HABITUDE_DE_VIE_UPDATE",
      patient_id: habitude.patient_id,
      entity_id: habitude.id,
      old_data: oldHabitude ?? null,
      new_data: habitude,
    });

    res.status(200).json({
      success: true,
      message: "Habitudes de vie mises a jour avec succes",
      habitude,
    });
  } catch (error) {
    console.error("Update habitude error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
