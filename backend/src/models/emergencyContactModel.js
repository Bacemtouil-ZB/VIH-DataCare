// models/emergencyContactModel.js

import pool from "../config/db.js";

export const findAllContacts = async () => {
  const { rows } = await pool.query(`
    SELECT id, nom, telephone, whatsapp, email, description, created_at, updated_at
    FROM emergency_contacts
    ORDER BY created_at DESC
  `);
  return rows;
};

export const findContactById = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM emergency_contacts WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
};

export const createContact = async ({ nom, telephone, whatsapp, email, description, created_by }) => {
  const { rows } = await pool.query(`
    INSERT INTO emergency_contacts (nom, telephone, whatsapp, email, description, created_by)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [nom, telephone, whatsapp, email, description, created_by]);
  return rows[0];
};

export const updateContact = async (id, { nom, telephone, whatsapp, email, description }) => {
  const { rows } = await pool.query(`
    UPDATE emergency_contacts
    SET nom = $1, telephone = $2, whatsapp = $3, email = $4, description = $5, updated_at = NOW()
    WHERE id = $6
    RETURNING *
  `, [nom, telephone, whatsapp, email, description, id]);
  return rows[0] || null;
};

export const deleteContact = async (id) => {
  const { rowCount } = await pool.query(
    `DELETE FROM emergency_contacts WHERE id = $1`,
    [id]
  );
  return rowCount > 0;
};