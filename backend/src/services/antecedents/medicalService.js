import pool from "../../config/db.js";
import { getMedical, createMedical, updateMedical } from "../../models/antecedents/medicalModel.js";

export const fetchMedical = async (patientId) => {
  try {
    const medical = await getMedical(patientId);
    return medical;
  } catch (error) {
    console.error("Error fetching medical antecedent:", error);
    throw new Error("Failed to fetch medical antecedent");
  }
};

export const addMedical = async (patientId, payload, userId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const medical = await createMedical(client, patientId, payload, userId);
    await client.query("COMMIT");
    return medical;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating medical antecedent:", error);
    throw new Error("Failed to create medical antecedent");
  } finally {
    client.release();
  }
};

export const editMedical = async (patientId, payload, userId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const medical = await updateMedical(client, patientId, payload, userId);
    await client.query("COMMIT");
    return medical;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating medical antecedent:", error);
    throw new Error("Failed to update medical antecedent");
  } finally {
    client.release();
  }
};