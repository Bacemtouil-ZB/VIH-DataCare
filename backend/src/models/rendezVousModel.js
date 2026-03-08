import pool from "../config/db.js";

// rendezvousModel.js
export const createRendezvous = async (data) => {
  const { numero_dossier, date, heure, type, statut, commentaire } = data;
  const query = `
    INSERT INTO rendezvous (patient_id, date, heure, type, statut, commentaire)
    SELECT p.id, $2, $3, $4, $5, $6
    FROM patients p
    WHERE p.numero = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [
    numero_dossier, date, heure, type, statut, commentaire || null,
  ]);
  if (!result.rows[0]) throw new Error("Patient non trouvé");
  return result.rows[0];
};

export const getRendezvousByNumeroDossier = async (numeroDossier) => {
  const query = `
    SELECT rdv.*
    FROM rendezvous rdv
    JOIN patients p ON rdv.patient_id = p.id
    WHERE p.numero = $1
    ORDER BY rdv.date DESC, rdv.heure DESC;
  `;
  const result = await pool.query(query, [numeroDossier]);
  return result.rows;
};

export const getRendezvousById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM rendezvous WHERE id = $1;`,
    [id]
  );
  return result.rows[0] || null;
};

export const updateRendezvous = async (id, data) => {
  const { date, heure, type, statut, commentaire } = data;
  const query = `
    UPDATE rendezvous
    SET date        = COALESCE($1, date),
        heure       = COALESCE($2, heure),
        type        = COALESCE($3, type),
        statut      = COALESCE($4, statut),
        commentaire = COALESCE($5, commentaire),
        updated_at  = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *;
  `;
  const result = await pool.query(query, [
    date || null,
    heure || null,
    type || null,
    statut || null,
    commentaire || null,
    id,
  ]);
  return result.rows[0];
};