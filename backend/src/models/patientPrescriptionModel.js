import pool from "../config/db.js";

// ─────────────────────────────────────────────────────────────────────────────
// Les champs ecart_jours et statut_patient sont calculés directement en SQL.
// Plus aucune dépendance sur SuiviTherapeutique.js côté JS.
//
// Logique statut_patient (identique à suiviTherapeutiqueModel.js) :
//   "en attente"             → prescription pas encore délivrée
//   "récupéré perdue de vue" → était perdue de vue + nouvelle livraison récente (90j)
//   "perdue de vue"          → ecart > 60 j sans livraison récente
//   "en retard"              → ecart 1–60 j
//   "actif"                  → ecart ≤ 0
// ─────────────────────────────────────────────────────────────────────────────

export const getPatientsWithPrescriptions = async () => {
  const query = `
    SELECT
      p.id                                            AS patient_id,
      p.numero                                        AS numero_dossier,
      p.name                                          AS patient_name,
      p.surname                                       AS patient_surname,
      p.birthdate                                     AS date_naissance,

      pe.id                                           AS prescription_id,
      pe.date                                         AS date_debut_traitement,
      pe.posologie,
      pe.periode                                      AS periode_prescrite,
      pe.periode_modifiee,
      COALESCE(pe.periode_modifiee, pe.periode)       AS periode_effective,
      pe.statut                                       AS statut_prescription,
      pe.date_delivrance,
      pe.remarque,

      -- Traitements depuis prescription_lignes
      COALESCE(
        STRING_AGG(
          COALESCE(sm.code, sm.composition, pl.medicament_nom_snapshot),
          ', ' ORDER BY pl.id
        ) FILTER (WHERE pl.id IS NOT NULL),
        'Aucun'
      )                                               AS nom_traitement,

      -- Suivi thérapeutique
      st.date_prochaine_prise,

      -- Écart en jours (≥ 0)
      CASE
        WHEN st.date_prochaine_prise IS NULL THEN 0
        ELSE GREATEST(0, CURRENT_DATE - st.date_prochaine_prise)
      END                                             AS ecart_jours,

      -- Statut patient calculé dynamiquement
      CASE
        WHEN pe.statut NOT IN ('delivree', 'modifie')
          THEN 'en attente'
        WHEN st.date_prochaine_prise IS NULL
          THEN 'en attente'
        WHEN (CURRENT_DATE - st.date_prochaine_prise) > 60
          AND EXISTS (
            SELECT 1 FROM prescription_medicale pm2
            WHERE pm2.patient_id = pe.patient_id
              AND pm2.statut IN ('delivree', 'modifie')
              AND pm2.date_delivrance >= CURRENT_DATE - INTERVAL '90 days'
              AND pm2.id <> pe.id
          )
          THEN 'récupéré perdue de vue'
        WHEN (CURRENT_DATE - st.date_prochaine_prise) > 60
          THEN 'perdue de vue'
        WHEN (CURRENT_DATE - st.date_prochaine_prise) BETWEEN 1 AND 60
          THEN 'en retard'
        ELSE 'actif'
      END                                             AS statut_patient,

      pe.created_at                                   AS prescription_created_at

    FROM prescription_medicale pe
    INNER JOIN patients              p  ON p.id  = pe.patient_id
    LEFT  JOIN prescription_lignes   pl ON pl.prescription_id = pe.id
    LEFT  JOIN stock_medicaments     sm ON sm.id = pl.medicament_id
    LEFT  JOIN suivi_therapeutique   st ON st.prescription_id = pe.id

    GROUP BY
      p.id, p.numero, p.name, p.surname, p.birthdate,
      pe.id, pe.date, pe.posologie, pe.periode, pe.periode_modifiee,
      pe.statut, pe.date_delivrance, pe.remarque,
      st.date_prochaine_prise,
      pe.created_at

    ORDER BY pe.created_at DESC;
  `;

  const result = await pool.query(query);
  return result.rows;
};