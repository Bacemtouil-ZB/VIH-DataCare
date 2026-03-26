import pool from "../config/db.js";
import {
  createPrescriptionExamen as createPrescriptionExamenModel,
  getPrescriptionsByNumeroDossier as getPrescriptionsByNumeroDossierModel,
  getPrescriptionById as getPrescriptionByIdModel,
  updatePrescriptionExamen as updatePrescriptionExamenModel,
} from "../models/prescriptionMedicalModel.js";
import {
  upsertSuiviTherapeutique,
} from "../models/prescriptionWorkflowModel.js";

export const createPrescriptionExamen = async (data, medecinId) => {
  const { numero_dossier, traitement, posologie } = data;

  if (!numero_dossier) throw new Error("Le numero de dossier est obligatoire");
  if (!traitement) throw new Error("Le medicament (traitement) est obligatoire");
  if (!posologie) throw new Error("La posologie est obligatoire");
  if (!medecinId) throw new Error("Medecin non authentifie");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const payload = {
      ...data,
      medecin_id: medecinId,
      date: new Date().toISOString().slice(0, 10),
      statut: "envoyee",
    };

    const prescription = await createPrescriptionExamenModel(payload, client);

    await upsertSuiviTherapeutique(
      {
        prescriptionId: prescription.id,
        patientId: prescription.patient_id,
        statutPatient: "en attente",
        dateProchainePrise: null,
        dateEcart: 0,
      },
      client,
    );

    await client.query("COMMIT");
    return prescription;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getPrescriptionsByNumeroDossier = async (numeroDossier) => {
  if (!numeroDossier) throw new Error("Le numero de dossier est obligatoire");
  return getPrescriptionsByNumeroDossierModel(numeroDossier);
};

export const getPrescriptionById = async (id) => {
  const prescription = await getPrescriptionByIdModel(id);
  if (!prescription) throw new Error("Prescription non trouvee");
  return prescription;
};

export const updatePrescriptionExamen = async (id, data) => {
  const existing = await getPrescriptionByIdModel(id);
  if (!existing) throw new Error("Prescription non trouvee");
  return updatePrescriptionExamenModel(id, data);
};
