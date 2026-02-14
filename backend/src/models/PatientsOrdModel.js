import pool from "../config/db.js";


export const getPatientsWithOrdonnances = async () => {
  const query = `
    SELECT 
      p.name as patient_name,
      p.surname as patient_surname,
      o.id as ordonnance_id,
      o.nom_traitement,
      o.date_debut_traitement,
      o.date_prochaine_prise,
      o.quantite_prescrite,
      o.statut
    FROM patients p
    INNER JOIN ordonnances o ON p.id = o.patient_id
    WHERE o.statut IS NOT NULL
    ORDER BY o.date_prochaine_prise DESC;
  `;

  const result = await pool.query(query);
  return result.rows;
};