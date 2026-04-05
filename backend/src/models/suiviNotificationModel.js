// suiviNotificationModel.js

import pool from "../config/db.js";

export const getNotificationsRdv = async () => {
  const query = `
    SELECT
      st.id                      AS suivi_id,
      st.patient_id,
      st.date_prochaine_prise,
      st.statut_patient,
      p.numero                   AS patient_numero,
      p.name                     AS patient_name,
      p.surname                  AS patient_surname
    FROM suivi_therapeutique st
    INNER JOIN patients p ON p.id = st.patient_id
    WHERE
      st.statut_patient = 'actif'
      AND st.date_prochaine_prise IS NOT NULL
    ORDER BY st.date_prochaine_prise ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};



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

