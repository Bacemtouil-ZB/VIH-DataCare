import pool from "../../config/db.js";
import { getSurgical, createSurgical, updateSurgical, deleteSurgical } from "../../models/antecedents/surgicalModel.js";

export const fetchSurgical = async (patientId) => {
  try {
    const surgical = await getSurgical(patientId);
    return surgical;
  } catch (error) {
    console.error("Error fetching surgical antecedents:", error);
    throw new Error("Failed to fetch surgical antecedents");
  }
};

export const addSurgical = async (patientId, payload, userId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const surgical = await createSurgical(client, patientId, payload, userId);
    await client.query("COMMIT");
    return surgical;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating surgical antecedent:", error);
    throw new Error("Failed to create surgical antecedent");
  } finally {
    client.release();
  }
};

export const editSurgical = async (id, payload) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const surgical = await updateSurgical(client, id, payload);
    await client.query("COMMIT");
    return surgical;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating surgical antecedent:", error);
    throw new Error("Failed to update surgical antecedent");
  } finally {
    client.release();
  }
};

export const removeSurgical = async (id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await deleteSurgical(client, id);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting surgical antecedent:", error);
    throw new Error("Failed to delete surgical antecedent");
  } finally {
    client.release();
  }
};