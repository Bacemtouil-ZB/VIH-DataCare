import pool from "../config/db.js";

// ── GET toutes notifications actives (< 7 jours) ──────────────
export const getNotifications = async () => {
  const query = `
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
    INNER JOIN patients p              ON p.id  = n.patient_id
    LEFT  JOIN suivi_therapeutique st  ON st.id = n.suivi_id
    LEFT  JOIN rendezvous rv           ON rv.id = n.rdv_id
    LEFT  JOIN prescription_medicale pm ON pm.id = n.prescription_id

    WHERE n.created_at >= NOW() - INTERVAL '7 days'
    ORDER BY n.created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// ── CREATE notification ───────────────────────────────────────
export const createNotification = async ({
  patient_id,
  type,
  suivi_id        = null,
  rdv_id          = null,
  prescription_id = null,
}) => {
  const result = await pool.query(
    `INSERT INTO notifications
      (patient_id, type, suivi_id, rdv_id, prescription_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *;`,
    [patient_id, type, suivi_id, rdv_id, prescription_id]
  );
  return result.rows[0];
};

// ── CHECK si notification existe déjà (éviter doublons) ──────
export const notificationExiste = async ({
  patient_id,
  type,
  suivi_id        = null,
  rdv_id          = null,
  prescription_id = null,
}) => {
  const result = await pool.query(
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
  return result.rows.length > 0;
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



//---── GET date_estimee par numéro patient - afficher dans rdv dans medecin ───────────────────────
export const getDateEstimeeByNumero = async (numero) => {
  const query = `
    SELECT
      st.date_prochaine_prise,
      p.numero    AS patient_numero,
      p.name      AS patient_name,
      p.surname   AS patient_surname
    FROM suivi_therapeutique st
    INNER JOIN patients p ON p.id = st.patient_id
    WHERE
      p.numero = $1
      AND st.statut_patient = 'actif'
      AND st.date_prochaine_prise IS NOT NULL
    ORDER BY st.date_prochaine_prise DESC
    LIMIT 1
  `;
  const result = await pool.query(query, [numero]);
  return result.rows[0] ?? null;
};