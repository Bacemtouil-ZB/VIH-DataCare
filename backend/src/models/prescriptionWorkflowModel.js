import pool from "../config/db.js";
import { createNotificationDelivrance } from "../services/suiviNotificationService.js";
const STATUTS_ADMIN = ['decede', 'decede_sida', 'transfere']; // pas le meme  que STATUTS_ALERTE pour logique métier
const STATUTS_ALERTE = ['decede', 'decede_sida', 'transfere'];

const normalizeNumero = (n) => {
  if (!n) return { withPrefix: null, raw: null };
  const raw = String(n).replace(/^F-/i, "").trim();
  return { withPrefix: `F-${raw}`, raw };
};

// ── SELECT de base ────────────────────────────────────────────
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


// ── Logique commune après délivrance ─────────────────────────
const traiterApresDelivrance = async (client, patientId, prescriptionId) => {
  // 1. Vérifier statut actuel du patient
  const { rows } = await client.query(
    `SELECT status FROM patients WHERE id = $1`,
    [patientId]
  );
  const statutActuel = rows[0]?.status;

  // 2. Si administratif → vérifier si alerte nécessaire
  if (STATUTS_ADMIN.includes(statutActuel)) {

    // decede, decede_sida, transfere → alerte contradiction
    if (STATUTS_ALERTE.includes(statutActuel)) {
      await client.query(
        `UPDATE suivi_therapeutique
         SET alerte_contradiction = true
         WHERE prescription_id = $1`,
        [prescriptionId]
      );
      return { alerte: true };
    }

    return { alerte: false };
  }

  // 3. Déterminer statut_patient pour suivi
  const etaitPerduDeVue = statutActuel === 'perdu_de_vue';
  const statutSuivi = etaitPerduDeVue ? 'recupere' : 'actif';

  // 4. Si recupere → mettre à jour suivi
  if (etaitPerduDeVue) {
    await client.query(
      `UPDATE suivi_therapeutique
       SET statut_patient = 'recupere'
       WHERE prescription_id = $1`,
      [prescriptionId]
    );
  }

  // 5. Mettre à jour patients.status → toujours actif après délivrance
  await client.query(
    `UPDATE patients
     SET status = 'actif', updated_at = NOW()
     WHERE id = $1`,
    [patientId]
  );

  return { alerte: false, statut_patient: statutSuivi };
};

// ── GET — prescriptions d'un patient ─────────────────────────
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

// ── GET by id ─────────────────────────────────────────────────
export const findById = async (id) => {
  const query = `
    ${PRESCRIPTION_SELECT}
    WHERE pm.id = $1
    ${PRESCRIPTION_GROUP};
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

// ── CREATE ────────────────────────────────────────────────────
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

    // 1. Insérer l'en-tête
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

    // 2. Snapshot médicaments depuis stock
    const stockResult = await client.query(
      `SELECT id, code FROM stock_medicaments WHERE id = ANY($1::int[]);`,
      [medicament_ids]
    );

    if (stockResult.rows.length !== medicament_ids.length) {
      throw new Error("Un ou plusieurs médicaments sont introuvables dans le stock");
    }

    // 3. Insérer lignes prescription
    for (const med of stockResult.rows) {
      await client.query(
        `INSERT INTO prescription_lignes
          (prescription_id, medicament_id, medicament_nom_snapshot)
         VALUES ($1, $2, $3);`,
        [prescription.id, med.id, med.code]
      );
    }

    await client.query("COMMIT");
    return findById(prescription.id);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
// ── VALIDER — sans modification ───────────────────────────────
export const validerPrescription = async (id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Mettre à jour prescription + créer suivi
    const { rows } = await client.query(`
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
        s.id             AS suivi_id,
        s.date_prochaine_prise,
        s.statut_patient AS suivi_statut_patient,
        s.date_ecart     AS suivi_date_ecart
      FROM updated u
      LEFT JOIN upsert_suivi s ON s.prescription_id = u.id;
    `, [id]);

    const prescription = rows[0];

    // 2. Traiter statut patient
    const { alerte } = await traiterApresDelivrance(
      client,
      prescription.patient_id,
      id
    );

    await client.query("COMMIT");

    // 3. Notification après COMMIT — hors transaction
    await createNotificationDelivrance({
      patient_id:      prescription.patient_id,
      suivi_id:        prescription.suivi_id,
      prescription_id: id,
      estAlerte:       alerte,
    }).catch((err) =>
      console.error("[Notif] Erreur delivrance:", err.message)
    );

    return { ...prescription, alerte };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
//------ VALIDER — avec modification de la période ─────────────────
export const validerAvecModification = async (id, periodeModifiee) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Mettre à jour prescription + créer suivi
    const { rows } = await client.query(`
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
        s.id             AS suivi_id,
        s.date_prochaine_prise,
        s.statut_patient AS suivi_statut_patient,
        s.date_ecart     AS suivi_date_ecart
      FROM updated u
      LEFT JOIN upsert_suivi s ON s.prescription_id = u.id;
    `, [id, periodeModifiee]);

    const prescription = rows[0];

    // 2. Traiter statut patient
    const { alerte } = await traiterApresDelivrance(
      client,
      prescription.patient_id,
      id
    );

    await client.query("COMMIT");

    // 3. Notification après COMMIT — hors transaction
    await createNotificationDelivrance({
      patient_id:      prescription.patient_id,
      suivi_id:        prescription.suivi_id,
      prescription_id: id,
      estAlerte:       alerte,
    }).catch((err) =>
      console.error("[Notif] Erreur delivrance:", err.message)
    );

    return { ...prescription, alerte };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// ── SUPPRIMER PRESCRIPTIONS EXPIRÉES > 48H ───────────────────
export const supprimerPrescriptionsExpirees = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: cibles } = await client.query(`
      SELECT id FROM prescription_medicale
      WHERE statut = 'non_validee'
        AND created_at < NOW() - INTERVAL '48 hours';
    `);

    if (cibles.length === 0) {
      await client.query("COMMIT");
      return [];
    }

    const ids = cibles.map((r) => r.id);

    await client.query(
      `DELETE FROM prescription_lignes WHERE prescription_id = ANY($1::int[]);`,
      [ids]
    );

    const { rows: supprimees } = await client.query(
      `DELETE FROM prescription_medicale
       WHERE id = ANY($1::int[])
       RETURNING id, patient_id, created_at;`,
      [ids]
    );

    await client.query("COMMIT");
    return supprimees;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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



// ── CRON — Recalculer écart et statuts patients avec suivi ───
export const recalculerEcartEtStatuts = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Dernière ligne suivi par patient (état actuel)
    const { rows: suivis } = await client.query(`
      SELECT DISTINCT ON (st.patient_id)
        st.id,
        st.patient_id,
        st.prescription_id,
        st.date_prochaine_prise,
        p.status AS statut_actuel_patient
      FROM suivi_therapeutique st
      JOIN patients p ON p.id = st.patient_id
      WHERE p.status NOT IN ('decede', 'decede_sida', 'transfere')
      ORDER BY st.patient_id, st.created_at DESC;
    `);

    if (suivis.length === 0) {
      await client.query("COMMIT");
      return [];
    }

    const updated = [];

    for (const suivi of suivis) {
      // 2. Calculer écart
      const ecart = Math.floor(
        (new Date() - new Date(suivi.date_prochaine_prise)) / (1000 * 60 * 60 * 24)
      );

      // 3. Déterminer statut
      let nouveauStatut;
      if (ecart <= 2)        nouveauStatut = 'actif';
      else if (ecart <= 179) nouveauStatut = 'en_retard';
      else                   nouveauStatut = 'perdu_de_vue';

      // 4. Mettre à jour suivi_therapeutique
      await client.query(
        `UPDATE suivi_therapeutique
         SET date_ecart     = $1,
             statut_patient = $2,
             updated_at     = NOW()
         WHERE id = $3`,
        [ecart, nouveauStatut, suivi.id]
      );

      // 5. Mettre à jour patients.status
      await client.query(
        `UPDATE patients
         SET status     = $1,
             updated_at = NOW()
         WHERE id = $2`,
        [nouveauStatut, suivi.patient_id]
      );

      updated.push({
        patient_id: suivi.patient_id,
        ecart,
        statut: nouveauStatut,
      });
    }

    await client.query("COMMIT");
    return updated;

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};