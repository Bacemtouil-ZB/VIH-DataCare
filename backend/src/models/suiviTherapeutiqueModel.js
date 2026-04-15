import pool from "../config/db.js";
//----------- get données de suivi thérapeutique------------------
// ── GET suivi par patient_id ──────────────────────────────────
export const getSuiviByPatientId = async (patientId) => {
  const query = `
    SELECT
      st.*,
      pm.dosage,
      pm.quantite                            AS quantite_prescrite,
      sm.code                                AS nom_traitement,
      sm.composition                         AS composition_medicament,
      pm.statut                              AS statut_prescription,
      pm.date_delivrance,
      p.numero                               AS numero_dossier,
      p.name                                 AS patient_name,
      p.surname                              AS patient_surname
    FROM suivi_therapeutique st
    INNER JOIN prescription_medicale pm ON st.prescription_id = pm.id
    LEFT  JOIN stock_medicaments      sm ON sm.id = pm.medicament_id
    INNER JOIN patients               p  ON st.patient_id = p.id
    WHERE st.patient_id = $1
    ORDER BY st.date_prochaine_prise DESC
  `;
  const result = await pool.query(query, [patientId]);
  return result.rows;
};

// ── GET suivi par numéro de dossier ──────────────────────────
export const getSuiviByNumeroDossier = async (numeroDossier) => {
  const query = `
    SELECT
      st.*,
      pm.dosage,
      pm.quantite                            AS quantite_prescrite,
      sm.code                                AS nom_traitement,
      sm.composition                         AS composition_medicament,
      pm.statut                              AS statut_prescription,
      pm.date_delivrance,
      p.numero                               AS numero_dossier,
      p.name                                 AS patient_name,
      p.surname                              AS patient_surname
    FROM suivi_therapeutique st
    INNER JOIN prescription_medicale pm ON st.prescription_id = pm.id
    LEFT  JOIN stock_medicaments      sm ON sm.id = pm.medicament_id
    INNER JOIN patients               p  ON st.patient_id = p.id
    WHERE p.numero = $1
    ORDER BY st.date_prochaine_prise DESC
  `;
  const result = await pool.query(query, [numeroDossier]);
  return result.rows;
};