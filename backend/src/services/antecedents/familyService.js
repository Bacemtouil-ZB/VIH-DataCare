import pool from "../../config/db.js";
import { getFamily, createFamily, updateFamily } from "../../models/antecedents/familyModel.js";

export const fetchFamily = async (patientId) => {
  try {
    const family = await getFamily(patientId);
    return family;
  } catch (error) {
    console.error("Error fetching family antecedent:", error);
    throw new Error("Failed to fetch family antecedent");
  }
};

export const addFamily = async (patientId, payload, userId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const family = await createFamily(client, patientId, payload, userId);
    await client.query("COMMIT");
    return family;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating family antecedent:", error);
    throw new Error("Failed to create family antecedent");
  } finally {
    client.release();
  }
};

export const editFamily = async (patientId, payload, userId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const family = await updateFamily(client, patientId, payload, userId);
    await client.query("COMMIT");
    return family;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating family antecedent:", error);
    throw new Error("Failed to update family antecedent");
  } finally {
    client.release();
  }
};