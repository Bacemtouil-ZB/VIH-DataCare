//cheked 15/04/2026
import pool from "../../config/db.js";
import { getTpePrep, createTpePrep, updateTpePrep, deleteTpePrep } from "../../models/antecedents/tpePrepModel.js";

export const fetchTpePrep = async (patientId) => {
  try {
    const tpePrep = await getTpePrep(patientId);
    return tpePrep;
  } catch (error) {
    console.error("Error fetching TPE/PrEP antecedents:", error);
    throw new Error("Failed to fetch TPE/PrEP antecedents");
  }
};

export const addTpePrep = async (patientId, payload, userId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const tpePrep = await createTpePrep(client, patientId, payload, userId);
    await client.query("COMMIT");
    return tpePrep;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating TPE/PrEP antecedent:", error);
    throw new Error("Failed to create TPE/PrEP antecedent");
  } finally {
    client.release();
  }
};

export const editTpePrep = async (id, payload) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const tpePrep = await updateTpePrep(client, id, payload);
    await client.query("COMMIT");
    return tpePrep;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating TPE/PrEP antecedent:", error);
    throw new Error("Failed to update TPE/PrEP antecedent");
  } finally {
    client.release();
  }
};

export const removeTpePrep = async (id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await deleteTpePrep(client, id);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting TPE/PrEP antecedent:", error);
    throw new Error("Failed to delete TPE/PrEP antecedent");
  } finally {
    client.release();
  }
};