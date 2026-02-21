import pool from "../config/db.js";

export const createSignesFonctionnels = async (examenCliniqueId, signesData) => {
  const query = `
    INSERT INTO signes_fonctionnels (
      examen_clinique_id, fievre, toux, dyspnee, sueurs_nocturnes, 
      cephalee, rhinorrhee, troubles_visuels, diarrhee, douleurs_abdomen,
      nausees, dysphagie, prurit, paresthesie, myalgie, arthralgie,
      anorexie, insomnie, troubles_humeur, asthenie, crampes, troubles_libido, ras
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
    RETURNING *;
  `;

  const values = [
    examenCliniqueId,
    signesData.fievre || false,
    signesData.toux || false,
    signesData.dyspnee || false,
    signesData.sueurs_nocturnes || false,
    signesData.cephalee || false,
    signesData.rhinorrhee || false,
    signesData.troubles_visuels || false,
    signesData.diarrhee || false,
    signesData.douleurs_abdomen || false,
    signesData.nausees || false,
    signesData.dysphagie || false,
    signesData.prurit || false,
    signesData.paresthesie || false,
    signesData.myalgie || false,
    signesData.arthralgie || false,
    signesData.anorexie || false,
    signesData.insomnie || false,
    signesData.troubles_humeur || false,
    signesData.asthenie || false,
    signesData.crampes || false,
    signesData.troubles_libido || false,
    signesData.ras || false
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};


export const createAutreSigneFonctionnel = async (signesFonctionnelsId, appareilId, description) => {
  const query = `
    INSERT INTO autres_signes_fonctionnels (
      signes_fonctionnels_id, appareil_id, description
    )
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const result = await pool.query(query, [signesFonctionnelsId, appareilId, description]);
  return result.rows[0];
};

export const getSignesByPatientNumero = async (numero) => {
  const query = `
    SELECT 
      ec.id as examen_id,
      ec.date_examen,
      p.numero as patient_numero,
      p.name as patient_name,
      p.surname as patient_surname,
      u.nom as medecin_nom,
      u.prenom as medecin_prenom,
      sf.*
    FROM examen_clinique ec
    INNER JOIN patients p ON ec.patient_id = p.id
    LEFT JOIN users u ON ec.medecin_id = u.id
    LEFT JOIN signes_fonctionnels sf ON ec.id = sf.examen_clinique_id
    WHERE p.numero = $1
    ORDER BY ec.date_examen DESC;
  `;

  const result = await pool.query(query, [numero]);
  return result.rows;
};


export const getSignesByExamenId = async (examenId) => {
  const query = `
    SELECT 
      ec.id as examen_id,
      ec.date_examen,
      p.numero as patient_numero,
      p.name as patient_name,
      p.surname as patient_surname,
      u.nom as medecin_nom,
      u.prenom as medecin_prenom,
      sf.*
    FROM examen_clinique ec
    INNER JOIN patients p ON ec.patient_id = p.id
    LEFT JOIN users u ON ec.medecin_id = u.id
    LEFT JOIN signes_fonctionnels sf ON ec.id = sf.examen_clinique_id
    WHERE ec.id = $1;
  `;

  const result = await pool.query(query, [examenId]);
  return result.rows[0] || null;
};

export const getAutresSignesByExamenId = async (examenId) => {
  const query = `
    SELECT 
      asf.id,
      asf.appareil_id,
      asf.description,
      asf.created_at,
      raf.libelle as appareil_libelle,
      raf.ordre as appareil_ordre
    FROM autres_signes_fonctionnels asf
    INNER JOIN signes_fonctionnels sf ON asf.signes_fonctionnels_id = sf.id
    INNER JOIN ref_appareil_fonctionnel raf ON asf.appareil_id = raf.id
    WHERE sf.examen_clinique_id = $1
    ORDER BY raf.ordre;
  `;

  const result = await pool.query(query, [examenId]);
  return result.rows;
};


export const updateSignesFonctionnels = async (signesFonctionnelsId, signesData) => {
  const query = `
    UPDATE signes_fonctionnels
    SET 
      fievre = $1, 
      toux = $2, 
      dyspnee = $3, 
      sueurs_nocturnes = $4,
      cephalee = $5, 
      rhinorrhee = $6, 
      troubles_visuels = $7, 
      diarrhee = $8,
      douleurs_abdomen = $9, 
      nausees = $10, 
      dysphagie = $11, 
      prurit = $12,
      paresthesie = $13, 
      myalgie = $14, 
      arthralgie = $15, 
      anorexie = $16,
      insomnie = $17, 
      troubles_humeur = $18, 
      asthenie = $19, 
      crampes = $20,
      troubles_libido = $21,
      ras = $22,
      updated_at = NOW()
    WHERE id = $23
    RETURNING *;
  `;

  const values = [
    signesData.fievre || false,
    signesData.toux || false,
    signesData.dyspnee || false,
    signesData.sueurs_nocturnes || false,
    signesData.cephalee || false,
    signesData.rhinorrhee || false,
    signesData.troubles_visuels || false,
    signesData.diarrhee || false,
    signesData.douleurs_abdomen || false,
    signesData.nausees || false,
    signesData.dysphagie || false,
    signesData.prurit || false,
    signesData.paresthesie || false,
    signesData.myalgie || false,
    signesData.arthralgie || false,
    signesData.anorexie || false,
    signesData.insomnie || false,
    signesData.troubles_humeur || false,
    signesData.asthenie || false,
    signesData.crampes || false,
    signesData.troubles_libido || false,
    signesData.ras || false,
    signesFonctionnelsId
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getAppareils = async () => {
  const query = `
    SELECT id, libelle, ordre
    FROM ref_appareil_fonctionnel
    ORDER BY ordre;
  `;

  const result = await pool.query(query);
  return result.rows;
};
