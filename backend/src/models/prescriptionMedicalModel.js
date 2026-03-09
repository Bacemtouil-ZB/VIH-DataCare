import pool from "../config/db.js";

// ── CREATE ────────────────────────────────────────────────────────────────────
// Résolution patient_id via SELECT depuis numero dossier — une seule requête SQL
export const createPrescriptionExamen = async (data) => {
  const { numero_dossier, medicament_id, traitement, posologie, dosage, date, quantite, remarque} = data;

  const query = `
    INSERT INTO prescription_medicale
      (patient_id, medicament_id, traitement, posologie, dosage, date, quantite, remarque)
    SELECT
      p.id, $2, $3, $4, $5, $6, $7, $8
    FROM patients p
    WHERE p.numero = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [
    numero_dossier,
    medicament_id  || null,
    traitement,
    posologie,
    dosage         || null,
    date,
    quantite       || null,
    remarque       || null,
  ]);

  if (!result.rows[0]) throw new Error("Patient non trouvé avec ce numéro de dossier");
  return result.rows[0];
};

// ── GET BY NUMERO DOSSIER ─────────────────────────────────────────────────────
export const getPrescriptionsByNumeroDossier = async (numeroDossier) => {
  const query = `
    SELECT
      pe.*,
      sm.code        AS medicament_code,
      sm.composition AS medicament_composition,
      sm.quantite    AS stock_disponible
    FROM prescription_medicale pe
    LEFT JOIN stock_medicaments sm ON pe.medicament_id = sm.id
    JOIN patients p ON pe.patient_id = p.id
    WHERE p.numero = $1
    ORDER BY pe.date DESC, pe.created_at DESC;
  `;
  const result = await pool.query(query, [numeroDossier]);
  return result.rows;
};

// ── GET BY ID ─────────────────────────────────────────────────────────────────
export const getPrescriptionById = async (id) => {
  const query = `
    SELECT
      pe.*,
      sm.code        AS medicament_code,
      sm.composition AS medicament_composition,
      sm.quantite    AS stock_disponible
    FROM prescription_medicale pe
    LEFT JOIN stock_medicaments sm ON pe.medicament_id = sm.id
    WHERE pe.id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

// ── UPDATE ────────────────────────────────────────────────────────────────────
export const updatePrescriptionExamen = async (id, data) => {
  const { medicament_id, traitement, posologie, dosage, date, quantite, remarque } = data;

  const query = `
    UPDATE prescription_medicale
    SET
      medicament_id = COALESCE($1, medicament_id),
      traitement    = COALESCE($2, traitement),
      posologie     = COALESCE($3, posologie),
      dosage        = COALESCE($4, dosage),
      date          = COALESCE($5, date),
      quantite      = COALESCE($6, quantite),
      remarque      = COALESCE($7, remarque)
    WHERE id = $8
    RETURNING *;
  `;

  const result = await pool.query(query, [
    medicament_id || null,
    traitement    || null,
    posologie     || null,
    dosage        || null,
    date          || null,
    quantite      || null,
    remarque      || null,
    id
  ]);

  return result.rows[0];
};