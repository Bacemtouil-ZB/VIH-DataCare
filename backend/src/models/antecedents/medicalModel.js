import pool from "../../config/db.js";

export const getMedical = async (numero) => {
  const result = await pool.query(
    `SELECT am.*
     FROM antecedent_medical am
     JOIN patients p ON p.id = am.patient_id
     WHERE p.numero = $1;`,
    [numero],
  );
  return result.rows[0] || null;
};

export const createMedical = async (client, numero, payload, userId) => {
  const {
    diabete,
    hypertension,
    cardiopathies,
    insuffisance_renale,
    maladies_hepatiques,
    asthme_bpco,
    cancers,
    autres,
    remarque,
  } = payload;

  const result = await client.query(
    `
    INSERT INTO antecedent_medical (
      patient_id,
      diabete, hypertension, cardiopathies, insuffisance_renale,
      maladies_hepatiques, asthme_bpco, cancers, autres, remarque,
      created_by, updated_by
    )
    SELECT p.id, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11
    FROM patients p
    WHERE p.numero = $1
    RETURNING *;
    `,
    [
      numero,
      diabete ?? false,
      hypertension ?? false,
      cardiopathies ?? false,
      insuffisance_renale ?? false,
      maladies_hepatiques ?? false,
      asthme_bpco ?? false,
      cancers ?? false,
      autres ?? null,
      remarque ?? null,
      userId,
    ],
  );
  return result.rows[0];
};

export const updateMedical = async (client, numero, payload, userId) => {
  const {
    diabete,
    hypertension,
    cardiopathies,
    insuffisance_renale,
    maladies_hepatiques,
    asthme_bpco,
    cancers,
    autres,
    remarque,
  } = payload;

  const result = await client.query(
    `
    UPDATE antecedent_medical am
    SET
      diabete             = $2,
      hypertension        = $3,
      cardiopathies       = $4,
      insuffisance_renale = $5,
      maladies_hepatiques = $6,
      asthme_bpco         = $7,
      cancers             = $8,
      autres              = $9,
      remarque            = $10,
      updated_by          = $11,
      updated_at          = NOW()
    FROM patients p
    WHERE am.patient_id = p.id
      AND p.numero = $1
    RETURNING am.*;
    `,
    [
      numero,
      diabete ?? false,
      hypertension ?? false,
      cardiopathies ?? false,
      insuffisance_renale ?? false,
      maladies_hepatiques ?? false,
      asthme_bpco ?? false,
      cancers ?? false,
      autres ?? null,
      remarque ?? null,
      userId,
    ],
  );
  return result.rows[0] || null;
};