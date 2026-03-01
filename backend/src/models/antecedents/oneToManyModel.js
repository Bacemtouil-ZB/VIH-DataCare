// ---------- 1-N replace mode: surgical / transfusion / aes ----------

export async function getSurgical(client, antecedentId) {
  const r = await client.query(
    `SELECT * FROM antecedent_surgical WHERE antecedent_id = $1 ORDER BY created_at DESC;`,
    [antecedentId],
  );
  return r.rows;
}

export async function replaceSurgical(client, antecedentId, rows, userId) {
  await client.query(
    `DELETE FROM antecedent_surgical WHERE antecedent_id = $1;`,
    [antecedentId],
  );
  if (!rows?.length) return [];

  const values = [];
  const placeholders = [];
  rows.forEach((r, i) => {
    const base = i * 4;
    placeholders.push(
      `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`,
    );
    values.push(
      antecedentId,
      r.description ?? null,
      r.date_intervention ?? null,
      userId,
    );
  });

  const q = `
    INSERT INTO antecedent_surgical (antecedent_id, description, date_intervention, created_by)
    VALUES ${placeholders.join(", ")}
    RETURNING *;
  `;
  const res = await client.query(q, values);
  return res.rows;
}

export async function getTransfusion(client, antecedentId) {
  const r = await client.query(
    `SELECT * FROM antecedent_transfusion WHERE antecedent_id = $1 ORDER BY created_at DESC;`,
    [antecedentId],
  );
  return r.rows;
}

export async function replaceTransfusion(client, antecedentId, rows, userId) {
  await client.query(
    `DELETE FROM antecedent_transfusion WHERE antecedent_id = $1;`,
    [antecedentId],
  );
  if (!rows?.length) return [];

  const values = [];
  const placeholders = [];
  rows.forEach((r, i) => {
    const base = i * 3;
    placeholders.push(`($${base + 1}, $${base + 2}, $${base + 3})`);
    values.push(antecedentId, r.date_transfusion ?? null, userId);
  });

  const q = `
    INSERT INTO antecedent_transfusion (antecedent_id, date_transfusion, created_by)
    VALUES ${placeholders.join(", ")}
    RETURNING *;
  `;
  const res = await client.query(q, values);
  return res.rows;
}

export async function getAes(client, antecedentId) {
  const r = await client.query(
    `SELECT * FROM antecedent_aes WHERE antecedent_id = $1 ORDER BY created_at DESC;`,
    [antecedentId],
  );
  return r.rows;
}

export async function replaceAes(client, antecedentId, rows, userId) {
  await client.query(`DELETE FROM antecedent_aes WHERE antecedent_id = $1;`, [
    antecedentId,
  ]);
  if (!rows?.length) return [];

  const values = [];
  const placeholders = [];
  rows.forEach((r, i) => {
    const base = i * 3;
    placeholders.push(`($${base + 1}, $${base + 2}, $${base + 3})`);
    values.push(antecedentId, r.date_aes ?? null, userId);
  });

  const q = `
    INSERT INTO antecedent_aes (antecedent_id, date_aes, created_by)
    VALUES ${placeholders.join(", ")}
    RETURNING *;
  `;
  const res = await client.query(q, values);
  return res.rows;
}
