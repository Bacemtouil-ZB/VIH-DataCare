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

export const createAddress = async (client, postal_code_id) => {
  if (!postal_code_id) return null;

  const result = await client.query(
    `
    INSERT INTO addresses (postal_code_id)
    VALUES ($1)
    RETURNING id
    `,
    [postal_code_id],
  );

  return result.rows[0].id;
};
// updateAddress.js
// updateAddress.js
export const updateAddress = async (client, addressId, postal_code_id) => {
  if (!addressId || !postal_code_id) return null;

  const result = await client.query(
    `
    UPDATE addresses
    SET postal_code_id = $1
    WHERE id = $2
    RETURNING id;
    `,
    [postal_code_id, addressId],
  );

  return result.rows[0]?.id || null;
};
