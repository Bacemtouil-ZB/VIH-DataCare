import pool from "../config/db.js";

export const addMedicalTreatment = async (treatmentData, medecinId) => {
  const {
    patient_id, // ✅ Utilisé au lieu de numeroDossier
    nom_traitement,
    quantite_prescrite,
    date_prescription,
    date_debut_traitement,
    date_prochaine_prise,
  } = treatmentData;

  const query = `
    INSERT INTO ordonnances (
      patient_id,
      medecin_id,
      nom_traitement,
      quantite_prescrite,
      date_prescription,
      date_debut_traitement,
      date_prochaine_prise,
      statut
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, 'en cours de suivi')
    RETURNING *;
  `;

  const values = [
    patient_id,
    medecinId,
    nom_traitement,
    quantite_prescrite,
    date_prescription || new Date(),
    date_debut_traitement,
    date_prochaine_prise || null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};
export const findMedicalTreatmentByNumeroDossier = async (numeroDossier) => {
  const query = `
    SELECT o.*,
           p.numero as numero_dossier,
           p.name as patient_name,
           p.surname as patient_surname
    FROM ordonnances o
    JOIN patients p ON o.patient_id = p.id
    WHERE p.numero = $1
    ORDER BY o.created_at DESC;
  `;
  
  const result = await pool.query(query, [numeroDossier]);
  return result.rows;
};

export const getThreeLastPrise = async (numeroDossier) => {
  const query = `
    SELECT o.*,
           p.numero as numero_dossier,
           p.name as patient_name,
           p.surname as patient_surname
    FROM ordonnances o
    JOIN patients p ON o.patient_id = p.id
    WHERE p.numero = $1
      AND o.date_prochaine_prise IS NOT NULL
    ORDER BY o.date_prochaine_prise DESC
    LIMIT 3;
  `;
  
  const result = await pool.query(query, [numeroDossier]);
  return result.rows;
};

export const getTreatmentStartDate = async (ordonnanceId) => {
  const query = `
    SELECT date_debut_traitement
    FROM ordonnances
    WHERE id = $1;
  `;
  
  const result = await pool.query(query, [ordonnanceId]);
  return result.rows[0]?.date_debut_traitement || null;
};

export const getNextIntakeDate = async (ordonnanceId) => {
  const query = `
    SELECT date_prochaine_prise
    FROM ordonnances
    WHERE id = $1;
  `;
  
  const result = await pool.query(query, [ordonnanceId]);
  return result.rows[0]?.date_prochaine_prise || null;
};

export const getOrdonnanceById = async (id) => {
  const query = `
    SELECT * FROM v_ordonnances_details
    WHERE id = $1;
  `;
  
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};
//medecin
export const updateOrdonnance = async (id, data) => {
  const {
    nom_traitement,
    quantite_prescrite,
    date_debut_traitement,
    date_prochaine_prise,
    statut,
  } = data;

  const query = `
    UPDATE ordonnances
    SET 
      nom_traitement = COALESCE($1, nom_traitement),
      quantite_prescrite = COALESCE($2, quantite_prescrite),
      date_debut_traitement = COALESCE($3, date_debut_traitement),
      date_prochaine_prise = COALESCE($4, date_prochaine_prise),
      statut = COALESCE($5, statut)
    WHERE id = $6
    RETURNING *;
  `;

  const values = [
    nom_traitement,
    quantite_prescrite,
    date_debut_traitement,
    date_prochaine_prise,
    statut,
    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// pour l analyste 
export const countOrdonnancesByStatut = async () => {
  const query = `
    SELECT 
      statut,
      COUNT(*) as count
    FROM ordonnances
    GROUP BY statut;
  `;
  
  const result = await pool.query(query);
  return result.rows;
};


export const getPatientsPerduDeVue = async () => {
  const query = `
    SELECT DISTINCT
      p.id,
      p.numero,
      p.name,
      p.surname,
      p.phone,
      o.duree_perte_de_vue,
      o.date_prochaine_prise
    FROM ordonnances o
    JOIN patients p ON o.patient_id = p.id
    WHERE o.statut = 'perdu de vue'
    ORDER BY o.duree_perte_de_vue DESC;
  `;
  
  const result = await pool.query(query);
  return result.rows;
};


export const updateDateProchainePrise = async (ordonnanceId, dateProchainePrise) => {
  const query = `
    UPDATE ordonnances
    SET date_prochaine_prise = $1
    WHERE id = $2
    RETURNING *;
  `;
  
  const result = await pool.query(query, [dateProchainePrise, ordonnanceId]);
  return result.rows[0];
};