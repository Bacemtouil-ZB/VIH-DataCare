import pool from "../../config/db.js";

export const createSignesFonctionnels = async (examenCliniqueId, signesData) => {
  const query = `
    INSERT INTO signes_fonctionnels (
      examen_clinique_id, fievre, toux, dyspnee, sueurs_nocturnes,
      cephalee, rhinorrhee, troubles_visuels, diarrhee, douleurs_abdomen,
      nausees, dysphagie, prurit, paresthesie, myalgie, arthralgie,
      anorexie, insomnie, troubles_humeur, asthenie, crampes, troubles_libido, ras
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
    RETURNING *,
      (SELECT ec.patient_id FROM examen_clinique ec WHERE ec.id = signes_fonctionnels.examen_clinique_id) AS patient_id;
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
    signesData.ras || false,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getSignesFonctionnelsByNumeroDossier = async (numeroDossier) => {
  const query = `
    SELECT sf.*, ec.date_examen, ec.patient_id
    FROM signes_fonctionnels sf
    JOIN examen_clinique ec ON sf.examen_clinique_id = ec.id
    JOIN patients p ON ec.patient_id = p.id
    WHERE p.numero = $1
    ORDER BY ec.date_examen DESC;
  `;
  const result = await pool.query(query, [numeroDossier]);
  return result.rows;
};

export const updateSignesFonctionnels = async (id, signesData) => {
  const query = `
    UPDATE signes_fonctionnels SET
      fievre=$1, toux=$2, dyspnee=$3, sueurs_nocturnes=$4,
      cephalee=$5, rhinorrhee=$6, troubles_visuels=$7, diarrhee=$8,
      douleurs_abdomen=$9, nausees=$10, dysphagie=$11, prurit=$12,
      paresthesie=$13, myalgie=$14, arthralgie=$15, anorexie=$16,
      insomnie=$17, troubles_humeur=$18, asthenie=$19, crampes=$20,
      troubles_libido=$21, ras=$22, updated_at=NOW()
    WHERE id = $23
    RETURNING *,
      (SELECT ec.patient_id FROM examen_clinique ec WHERE ec.id = signes_fonctionnels.examen_clinique_id) AS patient_id;
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
    id,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const createAutreSigneFonctionnel = async (signesFonctionnelsId, appareilId, description) => {
  const query = `
    INSERT INTO autres_signes_fonctionnels (signes_fonctionnels_id, appareil_id, description)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(query, [signesFonctionnelsId, appareilId, description]);
  return result.rows[0];
};

export const getAutresSignesBySignesFonctionnelsId = async (signesFonctionnelsId) => {
  const query = `
    SELECT
      asf.id,
      asf.appareil_id,
      asf.description,
      asf.created_at,
      raf.libelle AS appareil,
      raf.ordre AS appareil_ordre
    FROM autres_signes_fonctionnels asf
    JOIN ref_appareil_fonctionnel raf ON asf.appareil_id = raf.id
    WHERE asf.signes_fonctionnels_id = $1
    ORDER BY raf.ordre;
  `;
  const result = await pool.query(query, [signesFonctionnelsId]);
  return result.rows;
};

export const deleteAutresSignesBySignesFonctionnelsId = async (signesFonctionnelsId) => {
  await pool.query(
    `DELETE FROM autres_signes_fonctionnels WHERE signes_fonctionnels_id = $1;`,
    [signesFonctionnelsId]
  );
};

export const getAppareils = async () => {
  const result = await pool.query(`SELECT id, libelle, ordre FROM ref_appareil_fonctionnel ORDER BY ordre;`);
  return result.rows;
};
