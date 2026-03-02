import pool from "../../config/db.js";

// ── signes_cliniques ──────────────────────────────────────────────────────────

export const createSigneClinique = async (signeData) => {
  const { examen_clinique_id, poids, taille, imc } = signeData;
  const query = `
    INSERT INTO signes_cliniques (examen_clinique_id, poids, taille, imc)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const result = await pool.query(query, [examen_clinique_id, poids || null, taille || null, imc || null]);
  return result.rows[0];
};


export const getSigneCliniqueByNumeroDossier = async (numeroDossier) => {
  const query = `
    SELECT sc.*, ec.date_examen
    FROM signes_cliniques sc
    JOIN examen_clinique ec ON sc.examen_clinique_id = ec.id
    JOIN patients p ON ec.patient_id = p.id
    WHERE p.numero = $1
    ORDER BY ec.date_examen DESC;
  `;
  const result = await pool.query(query, [numeroDossier]);
  return result.rows;
};

export const updateSigneClinique = async (id, signeData) => {
  const { poids, taille, imc } = signeData;
  const query = `
    UPDATE signes_cliniques
    SET poids  = COALESCE($1, poids),
        taille = COALESCE($2, taille),
        imc    = COALESCE($3, imc)
    WHERE id = $4
    RETURNING *;
  `;
  const result = await pool.query(query, [poids || null, taille || null, imc || null, id]);
  return result.rows[0];
};

export const createAutreSigneClinique = async (signesCliniqueId, appareilId, description) => {
  const query = `
    INSERT INTO autres_signes_cliniques (signes_cliniques_id, appareil_id, description)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(query, [signesCliniqueId, appareilId, description]);
  return result.rows[0];
};

export const getAutresSignesBySigneCliniqueId = async (signesCliniqueId) => {
  const query = `
    SELECT
      asc2.id,
      asc2.appareil_id,
      asc2.description,
      asc2.created_at,
      raf.libelle AS appareil,
      raf.ordre   AS appareil_ordre
    FROM autres_signes_cliniques asc2
    JOIN ref_appareil_fonctionnel raf ON asc2.appareil_id = raf.id
    WHERE asc2.signes_cliniques_id = $1
    ORDER BY raf.ordre;
  `;
  const result = await pool.query(query, [signesCliniqueId]);
  return result.rows;
};


export const deleteAutresSignesBySigneCliniqueId = async (signesCliniqueId) => {
  const query = `DELETE FROM autres_signes_cliniques WHERE signes_cliniques_id = $1;`;
  await pool.query(query, [signesCliniqueId]);
};