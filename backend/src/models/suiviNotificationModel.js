import pool from "../config/db.js";

// ── GET toutes notifications actives (< 7 jours) ──────────────
export const getNotifications = async () => {
  const { rows } = await pool.query(`
    SELECT
      n.id              AS notif_id,
      n.type,
      n.created_at,
      n.patient_id,
      n.suivi_id,
      n.rdv_id,
      n.prescription_id,

      -- Patient
      p.numero          AS patient_numero,
      p.name            AS patient_name,
      p.surname         AS patient_surname,
      p.status          AS patient_status,

      -- Suivi thérapeutique
      st.date_prochaine_prise,
      st.date_ecart,
      st.alerte_contradiction,

      -- RDV
      rv.date           AS rdv_date,
      rv.heure          AS rdv_heure,
      rv.statut         AS rdv_statut,

      -- Prescription
      pm.statut         AS prescription_statut,
      pm.date_delivrance

    FROM notifications n
    INNER JOIN patients p               ON p.id  = n.patient_id
    LEFT  JOIN suivi_therapeutique st   ON st.id = n.suivi_id
    LEFT  JOIN rendezvous rv            ON rv.id = n.rdv_id
    LEFT  JOIN prescription_medicale pm ON pm.id = n.prescription_id

    WHERE n.created_at >= NOW() - INTERVAL '7 days'
    ORDER BY n.created_at DESC;
  `);
  return rows;
};

// ── CREATE notification ───────────────────────────────────────
export const createNotification = async ({
  patient_id,
  type,
  suivi_id        = null,
  rdv_id          = null,
  prescription_id = null,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO notifications
      (patient_id, type, suivi_id, rdv_id, prescription_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *;`,
    [patient_id, type, suivi_id, rdv_id, prescription_id]
  );
  return rows[0];
};

// ── CHECK si notification existe déjà (éviter doublons) ──────
export const notificationExiste = async ({
  patient_id,
  type,
  suivi_id        = null,
  rdv_id          = null,
  prescription_id = null,
}) => {
  const { rows } = await pool.query(
    `SELECT id FROM notifications
     WHERE patient_id = $1
       AND type = $2
       AND COALESCE(suivi_id, 0)        = COALESCE($3, 0)
       AND COALESCE(rdv_id, 0)          = COALESCE($4, 0)
       AND COALESCE(prescription_id, 0) = COALESCE($5, 0)
       AND created_at >= NOW() - INTERVAL '7 days'
     LIMIT 1;`,
    [patient_id, type, suivi_id, rdv_id, prescription_id]
  );
  return rows.length > 0;
};

// ── CLEANUP notifications > 7 jours (cron) ───────────────────
export const cleanupNotifications = async () => {
  const { rows } = await pool.query(
    `DELETE FROM notifications
     WHERE created_at < NOW() - INTERVAL '7 days'
     RETURNING id;`
  );
  return rows;
};

// ── GET patients en_retard (date_ecart = 1) ───────────────────
export const getPatientsEnRetard = async () => {
  const { rows } = await pool.query(`
    SELECT st.id AS suivi_id, st.patient_id
    FROM suivi_therapeutique st
    INNER JOIN patients p ON p.id = st.patient_id
    WHERE st.statut_patient = 'en_retard'
      AND st.date_ecart = 1
      AND p.status NOT IN ('decede','decede_sida','transfere','standard_inactif','migrant_inactif')
  `);
  return rows;
};

// ── GET patients perdus de vue ────────────────────────────────
export const getPatientsPerdusDeVue = async () => {
  const { rows } = await pool.query(`
    SELECT DISTINCT ON (st.patient_id)
      st.id AS suivi_id, st.patient_id
    FROM suivi_therapeutique st
    INNER JOIN patients p ON p.id = st.patient_id
    WHERE st.statut_patient = 'perdu_de_vue'
      AND p.status NOT IN ('decede','decede_sida','transfere','standard_inactif','migrant_inactif')
    ORDER BY st.patient_id, st.created_at DESC
  `);
  return rows;
};

// ── GET prescriptions non validées ───────────────────────────
export const getPrescriptionsNonValidees = async () => {
  const { rows } = await pool.query(`
    SELECT pm.id AS prescription_id, pm.patient_id
    FROM prescription_medicale pm
    INNER JOIN patients p ON p.id = pm.patient_id
    WHERE pm.statut = 'non_validee'
      AND p.status NOT IN ('decede','decede_sida','transfere','standard_inactif','migrant_inactif')
  `);
  return rows;
};

// ── GET RDV manqués ───────────────────────────────────────────
export const getRdvManques = async () => {
  const { rows } = await pool.query(`
    SELECT rv.id AS rdv_id, rv.patient_id
    FROM rendezvous rv
    INNER JOIN patients p ON p.id = rv.patient_id
    WHERE rv.date < CURRENT_DATE
      AND rv.statut NOT IN ('effectue','annule')
      AND p.status NOT IN ('decede','decede_sida','transfere','standard_inactif','migrant_inactif')
  `);
  return rows;
};

// ── GET RDV proches (dans les 7 prochains jours) ──────────────
export const getRdvProches = async () => {
  const { rows } = await pool.query(`
    SELECT rv.id AS rdv_id, rv.patient_id
    FROM rendezvous rv
    INNER JOIN patients p ON p.id = rv.patient_id
    WHERE rv.date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
      AND rv.statut NOT IN ('effectue','annule')
      AND p.status NOT IN ('decede','decede_sida','transfere','standard_inactif','migrant_inactif')
  `);
  return rows;
};

// ── GET date estimée prochaine prise par numéro patient ───────
export const getDateEstimeeByNumero = async (numero) => {
  const { rows } = await pool.query(`
    SELECT
      st.date_prochaine_prise,
      p.numero  AS patient_numero,
      p.name    AS patient_name,
      p.surname AS patient_surname
    FROM suivi_therapeutique st
    INNER JOIN patients p ON p.id = st.patient_id
    WHERE p.numero = $1
      AND st.statut_patient = 'actif'
      AND st.date_prochaine_prise IS NOT NULL
    ORDER BY st.date_prochaine_prise DESC
    LIMIT 1
  `, [numero]);
  return rows[0] ?? null;
};