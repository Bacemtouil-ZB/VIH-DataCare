import pool from "../../config/db.js";

export const getRendezvousByUserId = async (userId) => {
  const query = `
    SELECT 
      rdv.id,
      TO_CHAR(rdv.date, 'YYYY-MM-DD') as date,
      rdv.heure,
      rdv.type,
      rdv.statut,
      rdv.commentaire,
      rdv.created_at
    FROM rendezvous rdv
    JOIN patients p ON rdv.patient_id = p.id
    WHERE p.user_id = $1
    ORDER BY rdv.date DESC, rdv.heure DESC
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const getRendezvousDetailByIdAndUserId = async (rdvId, userId) => {
  const query = `
    SELECT 
      rdv.id,
      TO_CHAR(rdv.date, 'YYYY-MM-DD') as date,
      rdv.heure,
      rdv.type,
      rdv.statut,
      rdv.commentaire,
      rdv.created_at
    FROM rendezvous rdv
    JOIN patients p ON rdv.patient_id = p.id
    WHERE rdv.id = $1 AND p.user_id = $2
  `;
  const result = await pool.query(query, [rdvId, userId]);
  return result.rows[0] || null;
};