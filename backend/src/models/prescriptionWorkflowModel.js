import pool from "../config/db.js";

const PRESCRIPTION_SELECT = `
  SELECT
    pe.id,
    pe.patient_id,
    pe.medecin_id,
    pe.medicament_id,
    pe.traitement AS nom_traitement,
    pe.posologie,
    pe.dosage,
    pe.quantite AS quantite_prescrite,
    pe.date AS date_prescription,
    pe.date AS date_debut_traitement,
    pe.statut AS statut_prescription,
    pe.date_delivrance,
    pe.remarque,
    pe.created_at,
    pe.updated_at,
    st.date_prochaine_prise,
    st.date_ecart AS duree_perte_de_vue,
    CASE
      WHEN pe.statut = 'envoyee' THEN 'en attente'
      ELSE COALESCE(st.statut_patient, 'actif')
    END AS statut
`;

export const addMedicalTreatment = async (treatmentData, medecinId) => {
  const {
    patient_id,
    nom_traitement,
    quantite_prescrite,
    date_prescription,
    posologie,
    dosage,
    remarque,
  } = treatmentData;

  const query = `
    INSERT INTO prescription_medicale (
      patient_id,
      medecin_id,
      traitement,
      posologie,
      dosage,
      date,
      quantite,
      remarque,
      statut
    )
    VALUES ($1, $2, $3, $4, $5, COALESCE($6, CURRENT_DATE), $7, $8, 'envoyee')
    RETURNING *;
  `;

  const values = [
    patient_id,
    medecinId,
    nom_traitement,
    posologie || "Non renseignee",
    dosage || null,
    date_prescription || null,
    quantite_prescrite,
    remarque || null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

export const findMedicalTreatmentByNumeroDossier = async (numeroDossier) => {
  const query = `
    ${PRESCRIPTION_SELECT},
    p.numero AS numero_dossier,
    p.name AS patient_name,
    p.surname AS patient_surname
    FROM prescription_medicale pe
    JOIN patients p ON pe.patient_id = p.id
    LEFT JOIN suivi_therapeutique st ON st.prescription_id = pe.id
    WHERE p.numero = $1
    ORDER BY pe.created_at DESC;
  `;

  const result = await pool.query(query, [numeroDossier]);
  return result.rows;
};

export const getThreeLastPrise = async (numeroDossier) => {
  const query = `
    ${PRESCRIPTION_SELECT},
    p.numero AS numero_dossier,
    p.name AS patient_name,
    p.surname AS patient_surname
    FROM prescription_medicale pe
    JOIN patients p ON pe.patient_id = p.id
    LEFT JOIN suivi_therapeutique st ON st.prescription_id = pe.id
    WHERE p.numero = $1
      AND st.date_prochaine_prise IS NOT NULL
    ORDER BY st.date_prochaine_prise DESC
    LIMIT 3;
  `;

  const result = await pool.query(query, [numeroDossier]);
  return result.rows;
};

export const getTreatmentStartDate = async (prescriptionId) => {
  const query = `
    SELECT date AS date_debut_traitement
    FROM prescription_medicale
    WHERE id = $1;
  `;

  const result = await pool.query(query, [prescriptionId]);
  return result.rows[0]?.date_debut_traitement || null;
};

export const getNextIntakeDate = async (prescriptionId) => {
  const query = `
    SELECT date_prochaine_prise
    FROM suivi_therapeutique
    WHERE prescription_id = $1;
  `;

  const result = await pool.query(query, [prescriptionId]);
  return result.rows[0]?.date_prochaine_prise || null;
};

export const getPrescriptionById = async (id) => {
  const query = `
    ${PRESCRIPTION_SELECT}
    FROM prescription_medicale pe
    LEFT JOIN suivi_therapeutique st ON st.prescription_id = pe.id
    WHERE pe.id = $1;
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const updatePrescription = async (id, data) => {
  const {
    nom_traitement,
    quantite_prescrite,
    date_debut_traitement,
    statut_prescription,
    posologie,
    dosage,
    remarque,
  } = data;

  const query = `
    UPDATE prescription_medicale
    SET
      traitement = COALESCE($1, traitement),
      quantite = COALESCE($2, quantite),
      date = COALESCE($3, date),
      statut = COALESCE($4, statut),
      posologie = COALESCE($5, posologie),
      dosage = COALESCE($6, dosage),
      remarque = COALESCE($7, remarque),
      updated_at = NOW()
    WHERE id = $8
    RETURNING *;
  `;

  const values = [
    nom_traitement || null,
    quantite_prescrite || null,
    date_debut_traitement || null,
    statut_prescription || null,
    posologie || null,
    dosage || null,
    remarque || null,
    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

export const countPrescriptionsByStatut = async () => {
  const query = `
    SELECT statut, COUNT(*)::int AS count
    FROM (
      SELECT
        CASE
          WHEN pe.statut = 'envoyee' THEN 'en attente'
          ELSE COALESCE(st.statut_patient, 'actif')
        END AS statut
      FROM prescription_medicale pe
      LEFT JOIN suivi_therapeutique st ON st.prescription_id = pe.id
    ) source
    GROUP BY statut;
  `;

  const result = await pool.query(query);
  return result.rows;
};

export const getPatientsPerduDeVue = async () => {
  const query = `
    SELECT DISTINCT
      p.id,
      p.numero,
      p.name,
      p.surname,
      p.phone,
      st.date_ecart AS duree_perte_de_vue,
      st.date_prochaine_prise
    FROM suivi_therapeutique st
    JOIN patients p ON st.patient_id = p.id
    WHERE st.statut_patient = 'perdue de vue'
       OR (st.date_prochaine_prise IS NOT NULL AND (CURRENT_DATE - st.date_prochaine_prise) > 60)
    ORDER BY st.date_ecart DESC;
  `;

  const result = await pool.query(query);
  return result.rows;
};

export const updateDateProchainePrise = async (prescriptionId, dateProchainePrise) => {
  const upsertQuery = `
    INSERT INTO suivi_therapeutique (
      prescription_id,
      patient_id,
      statut_patient,
      date_prochaine_prise,
      date_ecart
    )
    SELECT
      pe.id,
      pe.patient_id,
      CASE
        WHEN (CURRENT_DATE - $1::date) > 60 THEN 'perdue de vue'
        ELSE 'actif'
      END,
      $1::date,
      GREATEST((CURRENT_DATE - $1::date), 0)
    FROM prescription_medicale pe
    WHERE pe.id = $2
    ON CONFLICT (prescription_id)
    DO UPDATE SET
      statut_patient = EXCLUDED.statut_patient,
      date_prochaine_prise = EXCLUDED.date_prochaine_prise,
      date_ecart = EXCLUDED.date_ecart,
      updated_at = NOW()
    RETURNING *;
  `;

  await pool.query(upsertQuery, [dateProchainePrise, prescriptionId]);
  return getPrescriptionById(prescriptionId);
};

export const validerPrescription = async (
  prescriptionId,
  { dateProchainePrise, statutPatient, ecartJours },
  db = pool,
) => {
  const updatePrescriptionQuery = `
    UPDATE prescription_medicale
    SET
      statut = 'delivree',
      date_delivrance = CURRENT_DATE,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *;
  `;

  const prescriptionRes = await db.query(updatePrescriptionQuery, [prescriptionId]);
  const prescription = prescriptionRes.rows[0] || null;
  if (!prescription) return null;

  await upsertSuiviTherapeutique(
    {
      prescriptionId: prescription.id,
      patientId: prescription.patient_id,
      statutPatient,
      dateProchainePrise,
      dateEcart: ecartJours > 0 ? ecartJours : 0,
    },
    db,
  );

  const detailsQuery = `
    ${PRESCRIPTION_SELECT}
    FROM prescription_medicale pe
    LEFT JOIN suivi_therapeutique st ON st.prescription_id = pe.id
    WHERE pe.id = $1;
  `;

  const detailsRes = await db.query(detailsQuery, [prescriptionId]);
  return detailsRes.rows[0] || null;
};

export const upsertSuiviTherapeutique = async (
  {
    prescriptionId,
    patientId,
    statutPatient,
    dateProchainePrise,
    dateEcart,
  },
  db = pool,
) => {
  const query = `
    INSERT INTO suivi_therapeutique (
      prescription_id,
      patient_id,
      statut_patient,
      date_prochaine_prise,
      date_ecart
    )
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (prescription_id)
    DO UPDATE SET
      patient_id = EXCLUDED.patient_id,
      statut_patient = EXCLUDED.statut_patient,
      date_prochaine_prise = EXCLUDED.date_prochaine_prise,
      date_ecart = EXCLUDED.date_ecart,
      updated_at = NOW()
    RETURNING *;
  `;

  const values = [
    prescriptionId,
    patientId,
    statutPatient,
    dateProchainePrise || null,
    dateEcart || 0,
  ];

  const result = await db.query(query, values);
  return result.rows[0] || null;
};
