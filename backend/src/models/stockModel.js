import pool from "../config/db.js";

export const listStockItems = async () => {
  const query = `
    SELECT id, code, composition, quantite, created_at, updated_at
    FROM stock_medicaments
    ORDER BY code ASC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const findStockItemById = async (id) => {
  const query = `
    SELECT id, code, composition, quantite, created_at, updated_at
    FROM stock_medicaments
    WHERE id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const createStockItem = async ({ code, composition, quantite, userId }) => {
  const query = `
    INSERT INTO stock_medicaments (code, composition, quantite, created_by, updated_by)
    VALUES ($1, $2, $3, $4, $4)
    RETURNING id, code, composition, quantite, created_at, updated_at;
  `;
  const values = [code, composition, quantite, userId || null];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updateStockQuantity = async (id, quantite, userId) => {
  const query = `
    UPDATE stock_medicaments
    SET quantite = $1,
        updated_by = $2,
        updated_at = NOW()
    WHERE id = $3
    RETURNING id, code, composition, quantite, created_at, updated_at;
  `;
  const result = await pool.query(query, [quantite, userId || null, id]);
  return result.rows[0] || null;
};

export const deleteStockItem = async (id) => {
  const query = `
    DELETE FROM stock_medicaments
    WHERE id = $1
    RETURNING id, code, composition, quantite, created_at, updated_at;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

