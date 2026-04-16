// cheked 15/04/2026
import {
  createPatient as createPatientService,
  getPatientByNumero as getPatientByNumeroService,
  checkPatientNumeroExists,
  getAllPatients as getAllPatientsService,
  updatePatient as updatePatientService,
} from "../services/patientService.js";

import { logAction } from "../services/auditService.js";

export const createPatientController = async (req, res) => {
  try {
    const patientData = req.body;
    const userId = req.user.id;

    const patient = await createPatientService(patientData, userId);

    //  Audit log APRÈS succès
    await logAction(req, {
      module: "PATIENT",
      action: "PATIENT_CREATE",
      patient_id: patient.id,
      entity_id: patient.id,
      new_data: patient,
    });

    res.status(201).json({
      success: true,
      message: "Patient créé avec succès",
      patient,
    });
  } catch (error) {
    console.error("Create patient error:", error.message);
    const statusCode = error.message.includes("existe déjà") ? 409 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPatientByNumeroController = async (req, res) => {
  try {
    const { numero } = req.params;
    const patient = await getPatientByNumeroService(numero);

    //Audit log pour PATIENT_VIEW
    if (patient) {
      await logAction(req, {
        module: "PATIENT",
        action: "PATIENT_VIEW",
        patient_id: patient.id,
        entity_id: patient.id,
        new_data: null,
        old_data: null,
      });
    }

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error("Get patient by numero error:", error.message);
    const statusCode = error.message.includes("non trouvé") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkNumeroExistsController = async (req, res) => {
  try {
    const { numero } = req.params;
    const result = await checkPatientNumeroExists(numero);

    res.status(200).json({
      success: true,
      exists: result.exists,
      patient: result.patient,
    });
  } catch (error) {
    console.error("Check numero error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPatientsController = async (req, res) => {
  try {
    const result = await getAllPatientsService();
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Get all patients error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePatientController = async (req, res) => {
  try {
    const { id } = req.params;
    const patientData = req.body;
    const userId = req.user.id;

    const old_data = await getPatientByNumeroService(patientData.numero);

    const patient = await updatePatientService(
      parseInt(id),
      patientData,
      userId,
    );

    //  Audit log APRÈS succès
    await logAction(req, {
      module: "PATIENT",
      action: "PATIENT_UPDATE",
      patient_id: patient.id,
      entity_id: patient.id,
      old_data: old_data,
      new_data: patient,
    });

    res.status(200).json({
      success: true,
      message: "Patient mis à jour avec succès",
      patient,
    });
  } catch (error) {
    console.error("Update patient error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

