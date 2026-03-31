import pool from "../../config/db.js";
import { getGyneco, createGyneco, updateGyneco } from "../../models/antecedents/gynecoModel.js";

export const fetchGyneco = async (patientId) => {
  try {
    const gyneco = await getGyneco(patientId);
    return gyneco;
  } catch (error) {
    console.error("Error fetching gyneco antecedent:", error);
    throw new Error("Failed to fetch gyneco antecedent");
  }
};

export const addGyneco = async (patientId, payload, userId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const gyneco = await createGyneco(client, patientId, payload, userId);
    await client.query("COMMIT");
    return gyneco;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating gyneco antecedent:", error);
    throw new Error("Failed to create gyneco antecedent");
  } finally {
    client.release();
  }
};

export const editGyneco = async (patientId, payload, userId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const gyneco = await updateGyneco(client, patientId, payload, userId);
    await client.query("COMMIT");
    return gyneco;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating gyneco antecedent:", error);
    throw new Error("Failed to update gyneco antecedent");
  } finally {
    client.release();
  }
};