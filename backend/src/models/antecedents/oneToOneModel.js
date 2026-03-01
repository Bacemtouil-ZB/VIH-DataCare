// ---------- 1-1 generic upsert/get for antecedent_* 1-1 tables ----------

async function upsertOneToOne(client, table, antecedentId, payload, userId) {
  const SYSTEM_KEYS = new Set([
    "id",
    "antecedent_id",
    "created_by",
    "updated_by",
    "created_at",
    "updated_at",
    "archived_by",
    "archived_at",
    // camelCase variants
    "antecedentId",
    "createdBy",
    "updatedBy",
    "createdAt",
    "updatedAt",
    "archivedBy",
    "archivedAt",
  ]);

  const cleanPayload = payload && typeof payload === "object" ? payload : {};
  const keys = Object.keys(cleanPayload).filter((k) => !SYSTEM_KEYS.has(k));
  if (keys.length === 0) return null;

  const cols = [];
  const placeholders = [];
  const updateSet = [];
  const values = [antecedentId];

  let index = 2;
  for (const key of keys) {
    cols.push(`"${key}"`);
    placeholders.push(`$${index}`);
    updateSet.push(`"${key}" = EXCLUDED."${key}"`);
    values.push(cleanPayload[key]);
    index++;
  }

  const query = `
    INSERT INTO ${table} (antecedent_id, ${cols.join(", ")}, updated_by, updated_at)
    VALUES ($1, ${placeholders.join(", ")}, $${values.length + 1}, NOW())
    ON CONFLICT (antecedent_id)
    DO UPDATE SET
      ${updateSet.join(", ")},
      updated_by = EXCLUDED.updated_by,
      updated_at = NOW()
    RETURNING *;
  `;

  const result = await client.query(query, [...values, userId]);
  return result.rows[0] || null;
}

async function getOneToOne(client, table, antecedentId) {
  const r = await client.query(
    `SELECT * FROM ${table} WHERE antecedent_id = $1;`,
    [antecedentId],
  );
  return r.rows[0] || null;
}

// (c, id, p, u) == (client, antecedentId, payload, userId)
export const getMedical = (c, id) => getOneToOne(c, "antecedent_medical", id);
export const upsertMedical = (c, id, p, u) =>
  upsertOneToOne(c, "antecedent_medical", id, p, u);

export const getInfectious = (c, id) =>
  getOneToOne(c, "antecedent_infectious", id);
export const upsertInfectious = (c, id, p, u) =>
  upsertOneToOne(c, "antecedent_infectious", id, p, u);

export const getTherapeutic = (c, id) =>
  getOneToOne(c, "antecedent_therapeutic", id);
export const upsertTherapeutic = (c, id, p, u) =>
  upsertOneToOne(c, "antecedent_therapeutic", id, p, u);

export const getFamily = (c, id) => getOneToOne(c, "antecedent_family", id);
export const upsertFamily = (c, id, p, u) =>
  upsertOneToOne(c, "antecedent_family", id, p, u);

export const getGyneco = (c, id) => getOneToOne(c, "antecedent_gyneco", id);
export const upsertGyneco = (c, id, p, u) =>
  upsertOneToOne(c, "antecedent_gyneco", id, p, u);
