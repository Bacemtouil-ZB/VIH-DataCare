import pool from "../../config/db.js";
import { getTransfusion, createTransfusion, updateTransfusion, deleteTransfusion } from "../../models/antecedents/transfusionModel.js";

export const fetchTransfusion = async (patientId) => {
  try {
    const transfusion = await getTransfusion(patientId);
    return transfusion;
  } catch (error) {
    console.error("Error fetching transfusion antecedents:", error);
    throw new Error("Failed to fetch transfusion antecedents");
  }
};

export const addTransfusion = async (patientId, payload, userId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const transfusion = await createTransfusion(client, patientId, payload, userId);
    await client.query("COMMIT");
    return transfusion;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating transfusion antecedent:", error);
    throw new Error("Failed to create transfusion antecedent");
  } finally {
    client.release();
  }
};

export const editTransfusion = async (id, payload) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const transfusion = await updateTransfusion(client, id, payload);
    await client.query("COMMIT");
    return transfusion;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating transfusion antecedent:", error);
    throw new Error("Failed to update transfusion antecedent");
  } finally {
    client.release();
  }
};

export const removeTransfusion = async (id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await deleteTransfusion(client, id);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting transfusion antecedent:", error);
    throw new Error("Failed to delete transfusion antecedent");
  } finally {
    client.release();
  }
};