// import pool from "../config/db.js";

// // Normalise le numéro de dossier : accepte "F-0012-2025" ou "0012-2025"
// const normalizeNumero = (n) => {
//   if (!n) return { withPrefix: null, raw: null };
//   const raw = String(n).replace(/^F-/i, "").trim();
//   return { withPrefix: `F-${raw}`, raw };
// };

// const PRESCRIPTION_SELECT = `
//   SELECT
//     pm.id,
//     pm.patient_id,
//     pm.medecin_id,
//     pm.medicament_id,
//     sm.code        AS traitement,
//     sm.composition AS composition_medicament,
//     pm.posologie,
//     pm.periode,
//     pm.periode_modifiee,
//     pm.date,
//     pm.statut,
//     pm.date_delivrance,
//     pm.remarque,
//     pm.created_at,
//     pm.updated_at
//   FROM prescription_medicale pm
//   LEFT JOIN stock_medicaments sm ON sm.id = pm.medicament_id
// `;

// // ── GET — prescriptions d'un patient via numero_dossier ───────
// export const findByNumeroDossier = async (numeroDossier) => {
//   const { withPrefix, raw } = normalizeNumero(numeroDossier);
//   const query = `
//     ${PRESCRIPTION_SELECT}
//     JOIN patients p ON p.id = pm.patient_id
//     WHERE p.numero = $1 OR p.numero = $2
//     ORDER BY pm.created_at DESC;
//   `;
//   const result = await pool.query(query, [withPrefix, raw]);
//   return result.rows;
// };

// // ── CREATE — nouvelle prescription ────────────────────────────
// export const createPrescription = async (
//   { patient_id, medecin_id, medicament_id, posologie, periode, remarque },
// ) => {
//   const query = `
//     INSERT INTO prescription_medicale
//       (patient_id, medecin_id, medicament_id, posologie, periode, remarque, statut)
//     VALUES ($1, $2, $3, $4, $5, $6, 'envoyee')
//     RETURNING *;
//   `;
//   const values = [
//     patient_id,
//     medecin_id || null,
//     medicament_id || null,
//     posologie || null,
//     Number(periode),
//     remarque || null,
//   ];
//   const result = await pool.query(query, values);
//   return result.rows[0] || null;
// };

// // ── VALIDER — Scénario 1 : Pharmacien valide sans modification ─────
// export const validerPrescription = async (id) => {
//   const query = `
//     WITH updated AS (
//       UPDATE prescription_medicale
//       SET
//         statut          = 'delivree',
//         date_delivrance = CURRENT_DATE,
//         updated_at      = NOW()
//       WHERE id = $1
//       RETURNING *
//     ),
//     upsert_suivi AS (
//       INSERT INTO suivi_therapeutique (
//         prescription_id,
//         patient_id,
//         date_prochaine_prise,
//         statut_patient,
//         date_ecart
//       )
//       SELECT
//         u.id,
//         u.patient_id,
//         -- Date prochaine prise = date_delivrance + periode (en jours)
//         (u.date_delivrance + (u.periode * INTERVAL '1 day'))::DATE,
//         'actif',
//         0
//       FROM updated u
//       ON CONFLICT (prescription_id)
//       DO UPDATE SET
//         patient_id           = EXCLUDED.patient_id,
//         date_prochaine_prise = EXCLUDED.date_prochaine_prise,
//         statut_patient       = EXCLUDED.statut_patient,
//         date_ecart           = EXCLUDED.date_ecart,
//         updated_at           = NOW()
//       RETURNING *
//     )
//     SELECT
//       u.*,
//       s.date_prochaine_prise,
//       s.statut_patient AS suivi_statut_patient,
//       s.date_ecart     AS suivi_date_ecart
//     FROM updated u
//     LEFT JOIN upsert_suivi s ON s.prescription_id = u.id;
//   `;
//   const result = await pool.query(query, [id]);
//   return result.rows[0] || null;
// };

// // ── VALIDER AVEC MODIFICATION — Scénario 2 : Pharmacien modifie période ─────
// export const validerAvecModification = async (id, periodeModifiee) => {
//   const query = `
//     WITH updated AS (
//       UPDATE prescription_medicale
//       SET
//         statut           = 'modifie',
//         periode_modifiee = $2,
//         date_delivrance  = CURRENT_DATE,
//         updated_at       = NOW()
//       WHERE id = $1
//       RETURNING *
//     ),
//     upsert_suivi AS (
//       INSERT INTO suivi_therapeutique (
//         prescription_id,
//         patient_id,
//         date_prochaine_prise,
//         statut_patient,
//         date_ecart
//       )
//       SELECT
//         u.id,
//         u.patient_id,
//         -- Date prochaine prise = date_delivrance + periode_modifiee (en jours)
//         (u.date_delivrance + (u.periode_modifiee * INTERVAL '1 day'))::DATE,
//         'actif',
//         0
//       FROM updated u
//       ON CONFLICT (prescription_id)
//       DO UPDATE SET
//         patient_id           = EXCLUDED.patient_id,
//         date_prochaine_prise = EXCLUDED.date_prochaine_prise,
//         statut_patient       = EXCLUDED.statut_patient,
//         date_ecart           = EXCLUDED.date_ecart,
//         updated_at           = NOW()
//       RETURNING *
//     )
//     SELECT
//       u.*,
//       s.date_prochaine_prise,
//       s.statut_patient AS suivi_statut_patient,
//       s.date_ecart     AS suivi_date_ecart
//     FROM updated u
//     LEFT JOIN upsert_suivi s ON s.prescription_id = u.id;
//   `;
//   const result = await pool.query(query, [id, periodeModifiee]);
//   return result.rows[0] || null;
// };

// // ── SUPPRIMER PRESCRIPTIONS NON VALIDÉES > 48H ─────────────────
// export const supprimerPrescriptionsExpirees = async () => {
//   const query = `
//     UPDATE prescription_medicale
//     SET 
//       statut = 'non_validee',
//       updated_at = NOW()
//     WHERE 
//       statut = 'envoyee'
//       AND created_at < NOW() - INTERVAL '48 hours'
//     RETURNING id;
//   `;
//   const result = await pool.query(query);
//   return result.rows;
// };

// // ── GET by id ──────────────────────────────────────────────────
// export const findById = async (id) => {
//   const query = `${PRESCRIPTION_SELECT} WHERE pm.id = $1;`;
//   const result = await pool.query(query, [id]);
//   return result.rows[0] || null;
// };

// // ── GET dernière prescription par patient ──────────────────────
// export const findLastPrescriptionPerPatient = async () => {
//   const query = `
//     SELECT DISTINCT ON (pm.patient_id)
//       pm.patient_id,
//       sm.code            AS traitement,
//       sm.composition     AS composition_medicament,
//       pm.date_delivrance AS derniere_consultation
//     FROM prescription_medicale pm
//     LEFT JOIN stock_medicaments sm ON sm.id = pm.medicament_id
//     ORDER BY pm.patient_id, pm.created_at DESC;
//   `;
//   const result = await pool.query(query);
//   return result.rows.reduce((acc, row) => {
//     acc[row.patient_id] = {
//       traitement: row.traitement || row.composition_medicament || "Aucun",
//       derniere_consultation: row.derniere_consultation,
//     };
//     return acc;
//   }, {});
// };


import pool from "../config/db.js";

const normalizeNumero = (n) => {
  if (!n) return { withPrefix: null, raw: null };
  const raw = String(n).replace(/^F-/i, "").trim();
  return { withPrefix: `F-${raw}`, raw };
};

// ── SELECT de base — récupère les médicaments depuis prescription_lignes ──
const PRESCRIPTION_SELECT = `
  SELECT
    pm.id,
    pm.patient_id,
    pm.medecin_id,
    pm.posologie,
    pm.periode,
    pm.periode_modifiee,
    pm.date,
    pm.statut,
    pm.date_delivrance,
    pm.remarque,
    pm.created_at,
    pm.updated_at,
    COALESCE(
      json_agg(
        json_build_object(
          'medicament_id',            pl.medicament_id,
          'medicament_nom_snapshot',  pl.medicament_nom_snapshot
        )
      ) FILTER (WHERE pl.id IS NOT NULL),
      '[]'
    ) AS medicaments
  FROM prescription_medicale pm
  LEFT JOIN prescription_lignes pl ON pl.prescription_id = pm.id
`;

const PRESCRIPTION_GROUP = `
  GROUP BY
    pm.id, pm.patient_id, pm.medecin_id, pm.posologie,
    pm.periode, pm.periode_modifiee, pm.date, pm.statut,
    pm.date_delivrance, pm.remarque, pm.created_at, pm.updated_at
`;

// ── GET — prescriptions d'un patient via numero_dossier ───────
export const findByNumeroDossier = async (numeroDossier) => {
  const { withPrefix, raw } = normalizeNumero(numeroDossier);
  const query = `
    ${PRESCRIPTION_SELECT}
    JOIN patients p ON p.id = pm.patient_id
    WHERE p.numero = $1 OR p.numero = $2
    ${PRESCRIPTION_GROUP}
    ORDER BY pm.created_at DESC;
  `;
  const result = await pool.query(query, [withPrefix, raw]);
  return result.rows;
};

// ── GET by id ──────────────────────────────────────────────────
export const findById = async (id) => {
  const query = `
    ${PRESCRIPTION_SELECT}
    WHERE pm.id = $1
    ${PRESCRIPTION_GROUP};
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

// ── CREATE — nouvelle prescription avec plusieurs médicaments ─
export const createPrescription = async ({
  patient_id,
  medecin_id,
  medicament_ids,
  posologie,
  periode,
  remarque,
}) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Insérer l'en-tête de l'ordonnance
    const insertPrescription = await client.query(
      `INSERT INTO prescription_medicale
        (patient_id, medecin_id, posologie, periode, remarque, statut)
       VALUES ($1, $2, $3, $4, $5, 'envoyee')
       RETURNING *;`,
      [
        patient_id,
        medecin_id || null,
        posologie || null,
        Number(periode),
        remarque || null,
      ]
    );

    const prescription = insertPrescription.rows[0];

    // 2. Récupérer les noms actuels depuis le stock (snapshot)
    const stockResult = await client.query(
      `SELECT id, code FROM stock_medicaments WHERE id = ANY($1::int[]);`,
      [medicament_ids]
    );

    // Vérifier que tous les médicaments existent
    if (stockResult.rows.length !== medicament_ids.length) {
      throw new Error("Un ou plusieurs médicaments sont introuvables dans le stock");
    }

    // 3. Insérer les lignes avec snapshot du nom
    const lignesValues = stockResult.rows.map((med) => [
      prescription.id,
      med.id,
      med.code,
    ]);

    for (const ligne of lignesValues) {
      await client.query(
        `INSERT INTO prescription_lignes
          (prescription_id, medicament_id, medicament_nom_snapshot)
         VALUES ($1, $2, $3);`,
        ligne
      );
    }

    await client.query("COMMIT");

    // 4. Retourner la prescription complète avec ses lignes
    return findById(prescription.id);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// ── VALIDER — Scénario 1 : sans modification ──────────────────
export const validerPrescription = async (id) => {
  const query = `
    WITH updated AS (
      UPDATE prescription_medicale
      SET
        statut          = 'delivree',
        date_delivrance = CURRENT_DATE,
        updated_at      = NOW()
      WHERE id = $1
      RETURNING *
    ),
    upsert_suivi AS (
      INSERT INTO suivi_therapeutique (
        prescription_id,
        patient_id,
        date_prochaine_prise,
        statut_patient,
        date_ecart
      )
      SELECT
        u.id,
        u.patient_id,
        (u.date_delivrance + (u.periode * INTERVAL '1 day'))::DATE,
        'actif',
        0
      FROM updated u
      ON CONFLICT (prescription_id)
      DO UPDATE SET
        patient_id           = EXCLUDED.patient_id,
        date_prochaine_prise = EXCLUDED.date_prochaine_prise,
        statut_patient       = EXCLUDED.statut_patient,
        date_ecart           = EXCLUDED.date_ecart,
        updated_at           = NOW()
      RETURNING *
    )
    SELECT
      u.*,
      s.date_prochaine_prise,
      s.statut_patient AS suivi_statut_patient,
      s.date_ecart     AS suivi_date_ecart
    FROM updated u
    LEFT JOIN upsert_suivi s ON s.prescription_id = u.id;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

// ── VALIDER AVEC MODIFICATION — Scénario 2 ───────────────────
export const validerAvecModification = async (id, periodeModifiee) => {
  const query = `
    WITH updated AS (
      UPDATE prescription_medicale
      SET
        statut           = 'modifie',
        periode_modifiee = $2,
        date_delivrance  = CURRENT_DATE,
        updated_at       = NOW()
      WHERE id = $1
      RETURNING *
    ),
    upsert_suivi AS (
      INSERT INTO suivi_therapeutique (
        prescription_id,
        patient_id,
        date_prochaine_prise,
        statut_patient,
        date_ecart
      )
      SELECT
        u.id,
        u.patient_id,
        (u.date_delivrance + (u.periode_modifiee * INTERVAL '1 day'))::DATE,
        'actif',
        0
      FROM updated u
      ON CONFLICT (prescription_id)
      DO UPDATE SET
        patient_id           = EXCLUDED.patient_id,
        date_prochaine_prise = EXCLUDED.date_prochaine_prise,
        statut_patient       = EXCLUDED.statut_patient,
        date_ecart           = EXCLUDED.date_ecart,
        updated_at           = NOW()
      RETURNING *
    )
    SELECT
      u.*,
      s.date_prochaine_prise,
      s.statut_patient AS suivi_statut_patient,
      s.date_ecart     AS suivi_date_ecart
    FROM updated u
    LEFT JOIN upsert_suivi s ON s.prescription_id = u.id;
  `;
  const result = await pool.query(query, [id, periodeModifiee]);
  return result.rows[0] || null;
};

// ── SUPPRIMER PRESCRIPTIONS EXPIRÉES > 48H ───────────────────
export const supprimerPrescriptionsExpirees = async () => {
  const query = `
    UPDATE prescription_medicale
    SET
      statut     = 'non_validee',
      updated_at = NOW()
    WHERE
      statut     = 'envoyee'
      AND created_at < NOW() - INTERVAL '48 hours'
    RETURNING id;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// ── GET dernière prescription par patient ─────────────────────
export const findLastPrescriptionPerPatient = async () => {
  const query = `
    SELECT DISTINCT ON (pm.patient_id)
      pm.patient_id,
      pm.date_delivrance AS derniere_consultation,
      COALESCE(
        string_agg(pl.medicament_nom_snapshot, ', '),
        'Aucun'
      ) AS traitement
    FROM prescription_medicale pm
    LEFT JOIN prescription_lignes pl ON pl.prescription_id = pm.id
    GROUP BY pm.patient_id, pm.date_delivrance, pm.created_at
    ORDER BY pm.patient_id, pm.created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows.reduce((acc, row) => {
    acc[row.patient_id] = {
      traitement: row.traitement,
      derniere_consultation: row.derniere_consultation,
    };
    return acc;
  }, {});
};