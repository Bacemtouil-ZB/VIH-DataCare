
import pool from "../config/db.js";

const PRESCRIPTION_SELECT = `
  SELECT
    pm.id,
    pm.patient_id,
    pm.medecin_id,
    pm.medicament_id,
    sm.code        AS traitement,
    sm.composition AS composition_medicament,
    pm.posologie,
    pm.dosage,
    pm.quantite,
    pm.date,
    pm.statut,
    pm.date_delivrance,
    pm.quantite_delivree,
    pm.remarque,
    pm.created_at,
    pm.updated_at
  FROM prescription_medicale pm
  LEFT JOIN stock_medicaments sm ON sm.id = pm.medicament_id
`;

// ── GET — prescriptions d'un patient via numero_dossier ───────
export const findByNumeroDossier = async (numeroDossier) => {
  const query = `
    ${PRESCRIPTION_SELECT}
    JOIN patients p ON p.id = pm.patient_id
    WHERE p.numero = $1
    ORDER BY pm.created_at DESC;
  `;
  const result = await pool.query(query, [numeroDossier]);
  return result.rows;
};

// ── CREATE — nouvelle prescription ────────────────────────────
// Reçoit patient_id déjà résolu par le service
export const createPrescription = async (
  { patient_id, medecin_id, medicament_id, posologie, dosage, quantite, remarque },
) => {
  const query = `
    INSERT INTO prescription_medicale
      (patient_id, medecin_id, medicament_id, posologie, dosage, quantite, remarque, statut)
    VALUES ($1, $2, $3, $4, $5, $6, $7, 'envoyee')
    RETURNING *;
  `;
  const values = [
    patient_id,
    medecin_id      || null,
    medicament_id   || null,
    posologie,
    dosage          || null,
    Number(quantite),
    remarque        || null,
  ];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

// ── VALIDER — passer statut → delivree ───────────────────────
export const validerPrescription = async (id) => {
  const query = `
    UPDATE prescription_medicale
    SET
      statut          = 'delivree',
      date_delivrance = CURRENT_DATE,
      updated_at      = NOW()
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

// ── GET by id — utilisé en interne par le service ─────────────
export const findById = async (id) => {
  const query = `${PRESCRIPTION_SELECT} WHERE pm.id = $1;`;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

/**
 * Mettre à jour la quantité délivrée par le pharmacien
 */
export const updateQuantiteDelivree = async (prescriptionId, quantiteDelivree) => {
  const query = `
    UPDATE prescription_medicale
    SET quantite_delivree = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `;
  
  const result = await pool.query(query, [quantiteDelivree, prescriptionId]);
  
  if (result.rows.length === 0) {
    throw new Error("Prescription introuvable");
  }
  
  return result.rows[0];
};
export const findLastPrescriptionPerPatient = async () => {
  const query = `
    SELECT DISTINCT ON (pm.patient_id)
      pm.patient_id,
      sm.code            AS traitement,
      sm.composition     AS composition_medicament,
      pm.date_delivrance AS derniere_consultation
    FROM prescription_medicale pm
    LEFT JOIN stock_medicaments sm ON sm.id = pm.medicament_id
    ORDER BY pm.patient_id, pm.created_at DESC;
  `;
  const result = await pool.query(query);
  // Retourne un map { patient_id: { traitement, derniere_consultation } }
  return result.rows.reduce((acc, row) => {
    acc[row.patient_id] = {
      traitement:            row.traitement || row.composition_medicament || "Aucun",
      derniere_consultation: row.derniere_consultation,
    };
    return acc;
  }, {});
};
 