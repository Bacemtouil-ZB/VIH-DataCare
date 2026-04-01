import pool from "../config/db.js";

// ── Helper : patient_id depuis numéro dossier ─────────────────────────────────
const getPatientId = async (numeroDossier) => {
  const res = await pool.query(
    "SELECT id FROM patients WHERE numero = $1", [numeroDossier]
  );
  if (!res.rows[0]) throw new Error("Patient non trouvé");
  return res.rows[0].id;
};

// ── CREATE ────────────────────────────────────────────────────────────────────
export const createResultat = async (data) => {
  const { numero_dossier, bilan_id, observations, date_resultat, ...champs } = data;
  const patient_id = await getPatientId(numero_dossier);

  // Construction dynamique des colonnes et valeurs
  const keys   = Object.keys(champs);
  const values = Object.values(champs);

  const cols   = ["patient_id", "bilan_id", "observations", "date_resultat", ...keys];
  const params = [patient_id, bilan_id || null, observations || null,
                  date_resultat || new Date().toISOString().slice(0,10), ...values];
  const placeholders = params.map((_, i) => `$${i + 1}`).join(", ");

  const query = `
    INSERT INTO resultats_biologiques (${cols.map(c => `"${c}"`).join(", ")})
    VALUES (${placeholders})
    RETURNING *;
  `;
  const result = await pool.query(query, params);
  return result.rows[0];
};

// ── GET BY NUMERO DOSSIER ─────────────────────────────────────────────────────
export const getResultatsByNumeroDossier = async (numeroDossier) => {
  const query = `
    SELECT rb.*
    FROM resultats_biologiques rb
    JOIN patients p ON rb.patient_id = p.id
    WHERE p.numero = $1
    ORDER BY rb.date_resultat DESC, rb.created_at DESC;
  `;
  const result = await pool.query(query, [numeroDossier]);
  return result.rows;
};

// ── GET DERNIER BILAN PRESCRIT ────────────────────────────────────────────────
export const getDernierBilanPrescrit = async (numeroDossier) => {
  const query = `
    SELECT be.*
    FROM bilan_examens be
    JOIN patients p ON be.patient_id = p.id
    WHERE p.numero = $1
    ORDER BY be.created_at DESC
    LIMIT 1;
  `;
  const result = await pool.query(query, [numeroDossier]);
  return result.rows[0] || null;
};

// ── GET BY ID ─────────────────────────────────────────────────────────────────
export const getResultatById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM resultats_biologiques WHERE id = $1", [id]
  );
  return result.rows[0] || null;
};

// ── UPDATE ────────────────────────────────────────────────────────────────────
export const updateResultat = async (id, data) => {
  const { observations, date_resultat, ...champs } = data;
  const keys   = Object.keys(champs);
  const values = Object.values(champs);

  // SET dynamique
  const setClauses = keys.map((k, i) => `"${k}" = $${i + 1}`).join(", ");
  const lastIdx = keys.length;

  const query = `
    UPDATE resultats_biologiques
    SET ${setClauses},
        observations  = $${lastIdx + 1},
        date_resultat = $${lastIdx + 2},
        updated_at    = NOW()
    WHERE id = $${lastIdx + 3}
    RETURNING *;
  `;
  const result = await pool.query(query, [
    ...values,
    observations || null,
    date_resultat || null,
    id,
  ]);
  return result.rows[0];
};
