import pool from "../config/db.js";

// ── Tous les champs bilan (ordre fixe) ───────────────────────────────────────
const BILAN_FIELDS = [
  "bilan_initial_complet",
  "serologie_vih",
  "bilan_biochimique",
  "serologie_vhb",
  "nfs_complete",
  "charge_virale_vih",
  "cd4_cd8",
  "bilan_lipidique",
  "serologie_vha",
  "serologie_vhc",
  "serologie_syphilis",
  "serologie_toxoplasmose",
  "serologie_cmv",
  "serologie_leishmaniose",
  "idr_tuberculine",
  "test_genotypage",
  "radio_thorax",
];

// ── CREATE ────────────────────────────────────────────────────────────────────
export const createBilanExamen = async (data) => {
  const { numero_dossier, observations, ...bilans } = data;

  const fields = BILAN_FIELDS.map((f) => bilans[f] ?? false);

  const query = `
    INSERT INTO bilan_examens (
      patient_id,
      bilan_initial_complet, serologie_vih, bilan_biochimique, serologie_vhb,
      nfs_complete, charge_virale_vih, cd4_cd8, bilan_lipidique,
      serologie_vha, serologie_vhc, serologie_syphilis, serologie_toxoplasmose,
      serologie_cmv, serologie_leishmaniose, idr_tuberculine,
      test_genotypage, radio_thorax, observations
    )
    SELECT
      p.id,
      $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19
    FROM patients p
    WHERE p.numero = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [
    numero_dossier,
    ...fields,
    observations || null,
  ]);

  if (!result.rows[0]) throw new Error("Patient non trouvé avec ce numéro de dossier");
  return result.rows[0];
};

// ── GET BY NUMERO DOSSIER ─────────────────────────────────────────────────────
export const getBilansByNumeroDossier = async (numeroDossier) => {
  const query = `
    SELECT be.*
    FROM bilan_examens be
    JOIN patients p ON be.patient_id = p.id
    WHERE p.numero = $1
    ORDER BY be.created_at DESC;
  `;
  const result = await pool.query(query, [numeroDossier]);
  return result.rows;
};

// ── GET BY ID ─────────────────────────────────────────────────────────────────
export const getBilanById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM bilan_examens WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

// ── UPDATE ────────────────────────────────────────────────────────────────────
export const updateBilanExamen = async (id, data) => {
  const { observations, ...bilans } = data;
  const fields = BILAN_FIELDS.map((f) => bilans[f] ?? null);

  const query = `
    UPDATE bilan_examens
    SET
      bilan_initial_complet  = COALESCE($1,  bilan_initial_complet),
      serologie_vih          = COALESCE($2,  serologie_vih),
      bilan_biochimique      = COALESCE($3,  bilan_biochimique),
      serologie_vhb          = COALESCE($4,  serologie_vhb),
      nfs_complete           = COALESCE($5,  nfs_complete),
      charge_virale_vih      = COALESCE($6,  charge_virale_vih),
      cd4_cd8                = COALESCE($7,  cd4_cd8),
      bilan_lipidique        = COALESCE($8,  bilan_lipidique),
      serologie_vha          = COALESCE($9,  serologie_vha),
      serologie_vhc          = COALESCE($10, serologie_vhc),
      serologie_syphilis     = COALESCE($11, serologie_syphilis),
      serologie_toxoplasmose = COALESCE($12, serologie_toxoplasmose),
      serologie_cmv          = COALESCE($13, serologie_cmv),
      serologie_leishmaniose = COALESCE($14, serologie_leishmaniose),
      idr_tuberculine        = COALESCE($15, idr_tuberculine),
      test_genotypage        = COALESCE($16, test_genotypage),
      radio_thorax           = COALESCE($17, radio_thorax),
      observations           = COALESCE($18, observations),
      updated_at             = NOW()
    WHERE id = $19
    RETURNING *;
  `;

  const result = await pool.query(query, [...fields, observations ?? null, id]);
  return result.rows[0];
};