import pool from "../config/db.js";

export const getAllGovernorates = async () => {
  const result = await pool.query(
    `SELECT id, name FROM governorates ORDER BY name`,
  );
  return result.rows;
};

export const getAllPostalCodes = async () => {
  const result = await pool.query(`
    SELECT p.id, p.code AS code_postal, g.name AS governorate
    FROM postal_codes p
    JOIN governorates g ON p.governorate_id = g.id
    ORDER BY g.name, p.code
  `);
  return result.rows;
};
