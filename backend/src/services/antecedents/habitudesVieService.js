import pool from "../../config/db.js";
import {
  getHabitudesVie,
  createHabitudesVie,
  updateHabitudesVie,
} from "../../models/antecedents/habitudesVieModel.js";

export const fetchHabitudesVie = async (patientId) => {
  try {
    const data = await getHabitudesVie(patientId);
    return data;
  } catch (error) {
    console.error("Error fetching habitudes de vie:", error);
    throw new Error("Failed to fetch habitudes de vie");
  }
};

export const addHabitudesVie = async (patientId, payload, userId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const data = await createHabitudesVie(client, patientId, payload, userId);
    await client.query("COMMIT");
    return data;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating habitudes de vie:", error);
    throw new Error("Failed to create habitudes de vie");
  } finally {
    client.release();
  }
};

export const editHabitudesVie = async (patientId, payload, userId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const data = await updateHabitudesVie(client, patientId, payload, userId);
    await client.query("COMMIT");
    return data;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating habitudes de vie:", error);
    throw new Error("Failed to update habitudes de vie");
  } finally {
    client.release();
  }
};