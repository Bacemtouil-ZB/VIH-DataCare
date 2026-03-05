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
    SELECT 
      p.id,
      p.place_name,          -- ✅ ADD THIS (name of delegation)
      p.code AS code_postal, -- keep code if you want
      g.name AS governorate
    FROM postal_codes p
    JOIN governorates g ON p.governorate_id = g.id
    ORDER BY g.name, p.place_name
  `);
  return result.rows;
};

export const createAddress = async (
  client,
  postal_code_id,
  exact_address = null,
) => {
  if (!postal_code_id) return null;

  const result = await client.query(
    `
    INSERT INTO addresses (postal_code_id, exact_address)
    VALUES ($1, $2)
    RETURNING id
    `,
    [postal_code_id, exact_address],
  );

  return result.rows[0].id;
};
// updateAddress.js
export const updateAddress = async (
  client,
  address_id,
  postal_code_id,
  exact_address = null,
) => {
  if (!address_id) return null;

  const result = await client.query(
    `
    UPDATE addresses
    SET postal_code_id = $1,
        exact_address  = $2
    WHERE id = $3
    RETURNING id
    `,
    [postal_code_id, exact_address, address_id],
  );

  return result.rows[0]?.id || null;
};
