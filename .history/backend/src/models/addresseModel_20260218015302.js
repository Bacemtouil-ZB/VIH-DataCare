import pool from "../config/db.js";

export const getAllAddresses = async () => {
  const query = `
    SELECT id, governorate, code_postal
    FROM addresses
    ORDER BY governorate, code_postal
  `;
  const result = await pool.query(query);
  return result.rows;
};
