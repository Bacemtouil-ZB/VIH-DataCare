import pool from "../../config/db.js";
import { getTherapeutic, createTherapeutic, updateTherapeutic } from "../../models/antecedents/therapeuticModel.js";

export const fetchTherapeutic = async (patientId) => {
  try {
    const therapeutic = await getTherapeutic(patientId);
    return therapeutic;
  } catch (error) {
    console.error("Error fetching therapeutic antecedent:", error);
    throw new Error("Failed to fetch therapeutic antecedent");
  }
};

export const addTherapeutic = async (patientId, payload, userId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const therapeutic = await createTherapeutic(client, patientId, payload, userId);
    await client.query("COMMIT");
    return therapeutic;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating therapeutic antecedent:", error);
    throw new Error("Failed to create therapeutic antecedent");
  } finally {
    client.release();
  }
};

export const editTherapeutic = async (patientId, payload, userId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const therapeutic = await updateTherapeutic(client, patientId, payload, userId);
    await client.query("COMMIT");
    return therapeutic;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating therapeutic antecedent:", error);
    throw new Error("Failed to update therapeutic antecedent");
  } finally {
    client.release();
  }
};