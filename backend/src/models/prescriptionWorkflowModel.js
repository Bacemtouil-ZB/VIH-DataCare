import pool from "../config/db.js";

// Normalise le numéro de dossier : accepte "F-0012-2025" ou "0012-2025"
const normalizeNumero = (n) => {
  if (!n) return { withPrefix: null, raw: null };
  const raw = String(n).replace(/^F-/i, "").trim();
  return { withPrefix: `F-${raw}`, raw };
};

const PRESCRIPTION_SELECT = `
  SELECT
    pm.id,
    pm.patient_id,
    pm.medecin_id,
    pm.medicament_id,
    sm.code        AS traitement,
    sm.composition AS composition_medicament,
    pm.dosage,
    pm.quantite,
    pm.date,
    pm.statut,
    pm.date_delivrance,
    pm.remarque,
    pm.created_at,
    pm.updated_at
  FROM prescription_medicale pm
  LEFT JOIN stock_medicaments sm ON sm.id = pm.medicament_id
`;

// ── GET — prescriptions d'un patient via numero_dossier ───────
export const findByNumeroDossier = async (numeroDossier) => {
  const { withPrefix, raw } = normalizeNumero(numeroDossier);
  const query = `
    ${PRESCRIPTION_SELECT}
    JOIN patients p ON p.id = pm.patient_id
    WHERE p.numero = $1 OR p.numero = $2
    ORDER BY pm.created_at DESC;
  `;
  const result = await pool.query(query, [withPrefix, raw]);
  return result.rows;
};

// ── CREATE — nouvelle prescription ────────────────────────────
export const createPrescription = async (
  { patient_id, medecin_id, medicament_id,  dosage, quantite, remarque },
) => {
  const query = `
    INSERT INTO prescription_medicale
      (patient_id, medecin_id, medicament_id,  dosage, quantite, remarque, statut)
    VALUES ($1, $2, $3, $4, $5, $6, 'envoyee')
    RETURNING *;
  `;
  const values = [
    patient_id,
    medecin_id      || null,
    medicament_id   || null,
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
    WITH updated AS (
      UPDATE prescription_medicale
      SET
        statut          = 'delivree',
        date_delivrance = COALESCE(date_delivrance, CURRENT_DATE),
        updated_at      = NOW()
      WHERE id = $1
      RETURNING *
    ),
    upsert_suivi AS (
      INSERT INTO suivi_therapeutique (
        prescription_id,
        patient_id,
        date_prochaine_prise,
        statut_patient,
        date_ecart
      )
      SELECT
        u.id,
        u.patient_id,
        (u.date_delivrance + (u.quantite * INTERVAL '1 month'))::DATE,
        CASE
          WHEN CURRENT_DATE - (u.date_delivrance + (u.quantite * INTERVAL '1 month'))::DATE > 60
            THEN 'perdue de vue'
          ELSE 'actif'
        END,
        GREATEST(
          0,
          CURRENT_DATE - (u.date_delivrance + (u.quantite * INTERVAL '1 month'))::DATE
        )
      FROM updated u
      ON CONFLICT (prescription_id)
      DO UPDATE SET
        patient_id          = EXCLUDED.patient_id,
        date_prochaine_prise = EXCLUDED.date_prochaine_prise,
        statut_patient      = EXCLUDED.statut_patient,
        date_ecart          = EXCLUDED.date_ecart,
        updated_at          = NOW()
      RETURNING *
    )
    SELECT
      u.*,
      s.date_prochaine_prise,
      s.statut_patient AS suivi_statut_patient,
      s.date_ecart     AS suivi_date_ecart
    FROM updated u
    LEFT JOIN upsert_suivi s ON s.prescription_id = u.id;
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
