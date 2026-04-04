import pool from "../config/db.js";

export const getPatientsWithPrescriptions = async () => {
  const query = `
    SELECT
      p.id                          AS patient_id,
      p.numero                      AS numero_dossier,
      p.name                        AS patient_name,
      p.surname                     AS patient_surname,
      p.birthdate                   AS date_naissance,
      pe.id                         AS prescription_id,
      pe.date                       AS date_debut_traitement,
      pe.posologie,
      pe.periode                    AS periode_prescrite,
      pe.periode_modifiee,
      pe.statut                     AS statut_prescription,
      pe.date_delivrance,
      -- Traitement : code du médicament depuis stock_medicaments
      COALESCE(sm.code, sm.composition, 'Aucun') AS nom_traitement,
      -- Suivi thérapeutique
      st.statut_patient,
      st.date_prochaine_prise,
      st.date_ecart                 AS suivi_date_ecart,
      pe.created_at                 AS prescription_created_at
    FROM prescription_medicale pe
    INNER JOIN patients          p  ON p.id  = pe.patient_id
    LEFT  JOIN stock_medicaments sm ON sm.id = pe.medicament_id
    LEFT  JOIN suivi_therapeutique st ON st.prescription_id = pe.id
    ORDER BY pe.created_at DESC;
  `;

  const result = await pool.query(query);
  return result.rows;
};