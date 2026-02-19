import pool from "../config/db.js";

export const getAllAddresses = async () => {
  const query = `
    SELECT 
      a.id,
      g.name AS governorate,
      p.code AS code_postal,
      a.exact_address
    FROM addresses a
    JOIN postal_codes p ON a.postal_code_id = p.id
    JOIN governorates g ON p.governorate_id = g.id
    ORDER BY g.name, p.code
  `;

  const result = await pool.query(query);
  return result.rows;
};

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
