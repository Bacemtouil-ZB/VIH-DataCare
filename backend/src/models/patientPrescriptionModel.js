import pool from "../config/db.js";

export const getPatientsWithPrescriptions = async () => {
  const query = `
    SELECT
      p.id                                            AS patient_id,
      p.numero                                        AS numero_dossier,
      p.name                                          AS patient_name,
      p.surname                                       AS patient_surname,
      p.birthdate                                     AS date_naissance,
      p.status                                        AS statut_patient,

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
      st.statut_patient                               AS suivi_statut_patient,
      st.date_ecart,
      st.alerte_contradiction,

      pe.created_at                                   AS prescription_created_at

    FROM prescription_medicale pe
    INNER JOIN patients              p  ON p.id  = pe.patient_id
    LEFT  JOIN prescription_lignes   pl ON pl.prescription_id = pe.id
    LEFT  JOIN stock_medicaments     sm ON sm.id = pl.medicament_id
    LEFT  JOIN suivi_therapeutique   st ON st.prescription_id = pe.id

    GROUP BY
      p.id, p.numero, p.name, p.surname, p.birthdate, p.status,
      pe.id, pe.date, pe.posologie, pe.periode, pe.periode_modifiee,
      pe.statut, pe.date_delivrance, pe.remarque,
      st.date_prochaine_prise, st.statut_patient,
      st.date_ecart, st.alerte_contradiction,
      pe.created_at

    ORDER BY pe.created_at DESC;
  `;

  const result = await pool.query(query);
  return result.rows;
};