import pool from "../config/db.js";

export const createPrescriptionExamen = async (data, db = pool) => {
  const {
    numero_dossier,
    medicament_id,
    traitement,
    posologie,
    dosage,
    date,
    quantite,
    remarque,
    medecin_id,
    statut = "envoyee",
  } = data;

  const query = `
    INSERT INTO prescription_medicale
      (patient_id, medicament_id, traitement, posologie, dosage, date, quantite, remarque, medecin_id, statut)
    SELECT
      p.id, $2, $3, $4, $5, COALESCE($6, CURRENT_DATE), $7, $8, $9, $10
    FROM patients p
    WHERE p.numero = $1
    RETURNING *;
  `;

  const result = await db.query(query, [
    numero_dossier,
    medicament_id || null,
    traitement,
    posologie,
    dosage || null,
    date || null,
    quantite || null,
    remarque || null,
    medecin_id || null,
    statut,
  ]);

  if (!result.rows[0]) {
    throw new Error("Patient non trouve avec ce numero de dossier");
  }
  return result.rows[0];
};

export const getPrescriptionsByNumeroDossier = async (numeroDossier) => {
  const query = `
    SELECT
      pe.*,
      sm.code AS medicament_code,
      sm.composition AS medicament_composition,
      sm.quantite AS stock_disponible,
      st.statut_patient,
      st.date_prochaine_prise,
      st.date_ecart
    FROM prescription_medicale pe
    LEFT JOIN stock_medicaments sm ON pe.medicament_id = sm.id
    LEFT JOIN suivi_therapeutique st ON st.prescription_id = pe.id
    JOIN patients p ON pe.patient_id = p.id
    WHERE p.numero = $1
    ORDER BY pe.date DESC, pe.created_at DESC;
  `;
  const result = await pool.query(query, [numeroDossier]);
  return result.rows;
};

export const getPrescriptionById = async (id) => {
  const query = `
    SELECT
      pe.*,
      sm.code AS medicament_code,
      sm.composition AS medicament_composition,
      sm.quantite AS stock_disponible,
      st.statut_patient,
      st.date_prochaine_prise,
      st.date_ecart
    FROM prescription_medicale pe
    LEFT JOIN stock_medicaments sm ON pe.medicament_id = sm.id
    LEFT JOIN suivi_therapeutique st ON st.prescription_id = pe.id
    WHERE pe.id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const updatePrescriptionExamen = async (id, data) => {
  const { medicament_id, traitement, posologie, dosage, date, quantite, remarque } = data;

  const query = `
    UPDATE prescription_medicale
    SET
      medicament_id = COALESCE($1, medicament_id),
      traitement = COALESCE($2, traitement),
      posologie = COALESCE($3, posologie),
      dosage = COALESCE($4, dosage),
      date = COALESCE($5, date),
      quantite = COALESCE($6, quantite),
      remarque = COALESCE($7, remarque),
      updated_at = NOW()
    WHERE id = $8
    RETURNING *;
  `;

  const result = await pool.query(query, [
    medicament_id || null,
    traitement || null,
    posologie || null,
    dosage || null,
    date || null,
    quantite || null,
    remarque || null,
    id,
  ]);

  return result.rows[0] || null;
};

export const updatePrescriptionStatutById = async (id, statut, db = pool) => {
  const query = `
    UPDATE prescription_medicale
    SET
      statut = $1,
      date_delivrance = CASE WHEN $1 = 'delivree' THEN CURRENT_DATE ELSE date_delivrance END,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `;
  const result = await db.query(query, [statut, id]);
  return result.rows[0] || null;
};
