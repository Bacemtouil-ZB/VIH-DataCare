import pool from "../config/db.js";

const STATUT_PATIENT_CASE = `
  CASE
    WHEN pm.statut NOT IN ('delivree', 'modifie')
      THEN 'en attente'
WHEN (CURRENT_DATE - st.date_prochaine_prise) > 60
  AND EXISTS (
    SELECT 1 
    FROM prescription_medicale pm2
    WHERE pm2.patient_id = st.patient_id
      AND pm2.statut IN ('delivree', 'modifie')        -- Prescription valide (délivrée ou modifiée)
      AND pm2.date_delivrance > st.date_prochaine_prise -- Prescription délivrée après la période de "perdue de vue"
      AND pm2.id <> pm.id
  THEN 'récupéré perdue de vue'
    WHEN (CURRENT_DATE - st.date_prochaine_prise) > 60
      THEN 'perdue de vue'
    WHEN (CURRENT_DATE - st.date_prochaine_prise) BETWEEN 1 AND 60
      THEN 'en retard'
    ELSE 'actif'
  END
`;

const ECART_JOURS_EXPR = `
  GREATEST(0, CURRENT_DATE - st.date_prochaine_prise)
`;

// ── GET suivi par patient_id ──────────────────────────────────
export const getSuiviByPatientId = async (patientId) => {
  const query = `
    SELECT
      st.id,
      st.prescription_id,
      st.patient_id,
      st.date_prochaine_prise,
      st.updated_at,

      -- Calcul dynamique de l'écart et du statut
      ${ECART_JOURS_EXPR}                AS ecart_jours,
      ${STATUT_PATIENT_CASE}             AS statut_patient,

      -- Période effective (modifiée prioritaire sur prescrite)
      COALESCE(pm.periode_modifiee, pm.periode)  AS periode_effective,
      pm.periode                                  AS periode_prescrite,
      pm.periode_modifiee,
      pm.posologie,
      pm.statut                                   AS statut_prescription,
      pm.date_delivrance,
      pm.remarque,

      -- Traitements (noms des médicaments)
      COALESCE(
        STRING_AGG(
          COALESCE(sm.code, sm.composition, pl.medicament_nom_snapshot),
          ', ' ORDER BY pl.id
        ) FILTER (WHERE pl.id IS NOT NULL),
        'Aucun'
      )                                           AS nom_traitement,

      -- Patient
      p.numero   AS numero_dossier,
      p.name     AS patient_name,
      p.surname  AS patient_surname,
      p.birthdate AS date_naissance

    FROM suivi_therapeutique st
    INNER JOIN prescription_medicale pm ON st.prescription_id = pm.id
    LEFT  JOIN prescription_lignes   pl ON pl.prescription_id = pm.id
    LEFT  JOIN stock_medicaments     sm ON sm.id = pl.medicament_id
    INNER JOIN patients              p  ON st.patient_id = p.id

    WHERE st.patient_id = $1

    GROUP BY
      st.id, st.prescription_id, st.patient_id,
      st.date_prochaine_prise, st.updated_at,
      pm.id, pm.periode, pm.periode_modifiee, pm.posologie,
      pm.statut, pm.date_delivrance, pm.remarque,
      p.id, p.numero, p.name, p.surname, p.birthdate

    ORDER BY st.date_prochaine_prise DESC;
  `;
  const result = await pool.query(query, [patientId]);
  return result.rows;
};

// ── GET suivi par numéro de dossier ───────────────────────────
export const getSuiviByNumeroDossier = async (numeroDossier) => {
  const query = `
    SELECT
      st.id,
      st.prescription_id,
      st.patient_id,
      st.date_prochaine_prise,
      st.updated_at,

      -- Calcul dynamique de l'écart et du statut
      ${ECART_JOURS_EXPR}                AS ecart_jours,
      ${STATUT_PATIENT_CASE}             AS statut_patient,

      -- Période effective
      COALESCE(pm.periode_modifiee, pm.periode)  AS periode_effective,
      pm.periode                                  AS periode_prescrite,
      pm.periode_modifiee,
      pm.posologie,
      pm.statut                                   AS statut_prescription,
      pm.date_delivrance,
      pm.remarque,

      -- Traitements
      COALESCE(
        STRING_AGG(
          COALESCE(sm.code, sm.composition, pl.medicament_nom_snapshot),
          ', ' ORDER BY pl.id
        ) FILTER (WHERE pl.id IS NOT NULL),
        'Aucun'
      )                                           AS nom_traitement,

      -- Patient
      p.numero   AS numero_dossier,
      p.name     AS patient_name,
      p.surname  AS patient_surname,
      p.birthdate AS date_naissance

    FROM suivi_therapeutique st
    INNER JOIN prescription_medicale pm ON st.prescription_id = pm.id
    LEFT  JOIN prescription_lignes   pl ON pl.prescription_id = pm.id
    LEFT  JOIN stock_medicaments     sm ON sm.id = pl.medicament_id
    INNER JOIN patients              p  ON st.patient_id = p.id

    WHERE p.numero = $1

    GROUP BY
      st.id, st.prescription_id, st.patient_id,
      st.date_prochaine_prise, st.updated_at,
      pm.id, pm.periode, pm.periode_modifiee, pm.posologie,
      pm.statut, pm.date_delivrance, pm.remarque,
      p.id, p.numero, p.name, p.surname, p.birthdate

    ORDER BY st.date_prochaine_prise DESC;
  `;
  const result = await pool.query(query, [numeroDossier]);
  return result.rows;
};

// ── UPDATE statut_patient en base (synchronisation périodique) ─
// Appelé par un job cron ou après chaque validation pour garder
// la table suivi_therapeutique cohérente avec les calculs SQL.
export const syncStatutPatient = async () => {  // 
  const query = `
    UPDATE suivi_therapeutique st
    SET
      statut_patient = sub.nouveau_statut,
      date_ecart     = sub.ecart_jours,
      updated_at     = NOW()
    FROM (
      SELECT
        st2.id,
        GREATEST(0, CURRENT_DATE - st2.date_prochaine_prise) AS ecart_jours,
        CASE
          WHEN pm.statut NOT IN ('delivree', 'modifie')
            THEN 'en attente'
WHEN (CURRENT_DATE - st.date_prochaine_prise) > 60
  AND EXISTS (
    SELECT 1 
    FROM prescription_medicale pm2
    WHERE pm2.patient_id = st.patient_id
      AND pm2.statut IN ('delivree', 'modifie')        -- Prescription valide (délivrée ou modifiée)
      AND pm2.date_delivrance > st.date_prochaine_prise -- Prescription délivrée après la période de "perdue de vue"
      AND pm2.id <> pm.id
  )
  THEN 'récupéré perdue de vue'
          WHEN (CURRENT_DATE - st2.date_prochaine_prise) > 60
            THEN 'perdue de vue'
          WHEN (CURRENT_DATE - st2.date_prochaine_prise) BETWEEN 1 AND 60
            THEN 'en retard'
          ELSE 'actif'
        END AS nouveau_statut
      FROM suivi_therapeutique st2
      INNER JOIN prescription_medicale pm ON pm.id = st2.prescription_id
    ) sub
    WHERE st.id = sub.id
    RETURNING st.id, st.statut_patient, st.date_ecart;
  `;
  const result = await pool.query(query);
  return result.rows;
};