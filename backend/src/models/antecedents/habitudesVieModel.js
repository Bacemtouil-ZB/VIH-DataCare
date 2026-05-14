//cheked 15/04/2026
import pool from "../../config/db.js";

// export const getHabitudesVie = async (numero) => {
//   const result = await pool.query(
//     `SELECT hv.*
//      FROM habitudes_vie hv
//      JOIN patients p ON p.id = hv.patient_id
//      WHERE p.numero = $1;`,
//     [numero]
//   );
//   return result.rows[0] || null;
// };

export const getHabitudesVie = async (numero) => {
  const result = await pool.query(
    `SELECT
      hv.id, hv.patient_id,
      hv.tabagisme, hv.alcoolemie, hv.activite_physique,
      hv.proteines,        TO_CHAR(hv.proteines_date,                   'YYYY-MM-DD') AS proteines_date,
      hv.creatine,         TO_CHAR(hv.creatine_date,                    'YYYY-MM-DD') AS creatine_date,
      hv.complements_vitaminiques, hv.complements_vitaminiques_type,
                           TO_CHAR(hv.complements_vitaminiques_date,    'YYYY-MM-DD') AS complements_vitaminiques_date,
      hv.multivitamines,   hv.multivitamines_type,
                           TO_CHAR(hv.multivitamines_date,              'YYYY-MM-DD') AS multivitamines_date,
      hv.plantes_medicinales, hv.plantes_medicinales_type,
                           TO_CHAR(hv.plantes_medicinales_date,         'YYYY-MM-DD') AS plantes_medicinales_date,
      hv.autres_complements, hv.autres_complements_type,
                           TO_CHAR(hv.autres_complements_date,          'YYYY-MM-DD') AS autres_complements_date,
      hv.drogues_injectables,
                           TO_CHAR(hv.drogues_injectables_date,         'YYYY-MM-DD') AS drogues_injectables_date,
      hv.cannabis,         TO_CHAR(hv.cannabis_date,                    'YYYY-MM-DD') AS cannabis_date,
      hv.cocaine,          TO_CHAR(hv.cocaine_date,                     'YYYY-MM-DD') AS cocaine_date,
      hv.crack,            TO_CHAR(hv.crack_date,                       'YYYY-MM-DD') AS crack_date,
      hv.heroine,          TO_CHAR(hv.heroine_date,                     'YYYY-MM-DD') AS heroine_date,
      hv.ecstasy,          TO_CHAR(hv.ecstasy_date,                     'YYYY-MM-DD') AS ecstasy_date,
      hv.pregabaline,      TO_CHAR(hv.pregabaline_date,                 'YYYY-MM-DD') AS pregabaline_date,
      hv.tramadol,         TO_CHAR(hv.tramadol_date,                    'YYYY-MM-DD') AS tramadol_date,
      hv.codeine,          TO_CHAR(hv.codeine_date,                     'YYYY-MM-DD') AS codeine_date,
      hv.chicha, hv.cafeine_excessive,
      hv.created_by, hv.updated_by, hv.created_at, hv.updated_at
     FROM habitudes_vie hv
     JOIN patients p ON p.id = hv.patient_id
     WHERE p.numero = $1;`,
    [numero]
  );
  return result.rows[0] || null;
};

export const createHabitudesVie = async (client, numero, payload, userId) => {
  const {
    tabagisme, alcoolemie, activite_physique,
    proteines, proteines_date,
    creatine, creatine_date,
    complements_vitaminiques, complements_vitaminiques_type, complements_vitaminiques_date,
    multivitamines, multivitamines_type, multivitamines_date,
    plantes_medicinales, plantes_medicinales_type, plantes_medicinales_date,
    autres_complements, autres_complements_type, autres_complements_date,
    drogues_injectables, drogues_injectables_date,
    cannabis, cannabis_date,
    cocaine, cocaine_date,
    crack, crack_date,
    heroine, heroine_date,
    ecstasy, ecstasy_date,
    pregabaline, pregabaline_date,
    tramadol, tramadol_date,
    codeine, codeine_date,
    chicha, cafeine_excessive,
  } = payload;

  const result = await client.query(
    `
    INSERT INTO habitudes_vie (
      patient_id,
      tabagisme, alcoolemie, activite_physique,
      proteines, proteines_date,
      creatine, creatine_date,
      complements_vitaminiques, complements_vitaminiques_type, complements_vitaminiques_date,
      multivitamines, multivitamines_type, multivitamines_date,
      plantes_medicinales, plantes_medicinales_type, plantes_medicinales_date,
      autres_complements, autres_complements_type, autres_complements_date,
      drogues_injectables, drogues_injectables_date,
      cannabis, cannabis_date,
      cocaine, cocaine_date,
      crack, crack_date,
      heroine, heroine_date,
      ecstasy, ecstasy_date,
      pregabaline, pregabaline_date,
      tramadol, tramadol_date,
      codeine, codeine_date,
      chicha, cafeine_excessive,
      created_by, updated_by
    )
    SELECT
      p.id,
      $2, $3, $4,
      $5, $6, $7, $8,
      $9, $10, $11,
      $12, $13, $14,
      $15, $16, $17,
      $18, $19, $20,
      $21, $22,
      $23, $24,
      $25, $26,
      $27, $28,
      $29, $30,
      $31, $32,
      $33, $34,
      $35, $36,
      $37, $38,
      $39, $40,
      $41, $41
    FROM patients p
    WHERE p.numero = $1
    RETURNING *;
    `,
    [
      numero,
      tabagisme ?? false, alcoolemie ?? false, activite_physique ?? false,
      proteines ?? false, proteines_date ?? null,
      creatine ?? false, creatine_date ?? null,
      complements_vitaminiques ?? false, complements_vitaminiques_type ?? null, complements_vitaminiques_date ?? null,
      multivitamines ?? false, multivitamines_type ?? null, multivitamines_date ?? null,
      plantes_medicinales ?? false, plantes_medicinales_type ?? null, plantes_medicinales_date ?? null,
      autres_complements ?? false, autres_complements_type ?? null, autres_complements_date ?? null,
      drogues_injectables ?? false, drogues_injectables_date ?? null,
      cannabis ?? false, cannabis_date ?? null,
      cocaine ?? false, cocaine_date ?? null,
      crack ?? false, crack_date ?? null,
      heroine ?? false, heroine_date ?? null,
      ecstasy ?? false, ecstasy_date ?? null,
      pregabaline ?? false, pregabaline_date ?? null,
      tramadol ?? false, tramadol_date ?? null,
      codeine ?? false, codeine_date ?? null,
      chicha ?? false, cafeine_excessive ?? false,
      userId,
    ]
  );
  return result.rows[0];
};

export const updateHabitudesVie = async (client, numero, payload, userId) => {
  const {
    tabagisme, alcoolemie, activite_physique,
    proteines, proteines_date,
    creatine, creatine_date,
    complements_vitaminiques, complements_vitaminiques_type, complements_vitaminiques_date,
    multivitamines, multivitamines_type, multivitamines_date,
    plantes_medicinales, plantes_medicinales_type, plantes_medicinales_date,
    autres_complements, autres_complements_type, autres_complements_date,
    drogues_injectables, drogues_injectables_date,
    cannabis, cannabis_date,
    cocaine, cocaine_date,
    crack, crack_date,
    heroine, heroine_date,
    ecstasy, ecstasy_date,
    pregabaline, pregabaline_date,
    tramadol, tramadol_date,
    codeine, codeine_date,
    chicha, cafeine_excessive,
  } = payload;

  const result = await client.query(
    `
    UPDATE habitudes_vie hv
    SET
      tabagisme                     = $2,
      alcoolemie                    = $3,
      activite_physique             = $4,
      proteines                     = $5,
      proteines_date                = $6,
      creatine                      = $7,
      creatine_date                 = $8,
      complements_vitaminiques      = $9,
      complements_vitaminiques_type = $10,
      complements_vitaminiques_date = $11,
      multivitamines                = $12,
      multivitamines_type           = $13,
      multivitamines_date           = $14,
      plantes_medicinales           = $15,
      plantes_medicinales_type      = $16,
      plantes_medicinales_date      = $17,
      autres_complements            = $18,
      autres_complements_type       = $19,
      autres_complements_date       = $20,
      drogues_injectables           = $21,
      drogues_injectables_date      = $22,
      cannabis                      = $23,
      cannabis_date                 = $24,
      cocaine                       = $25,
      cocaine_date                  = $26,
      crack                         = $27,
      crack_date                    = $28,
      heroine                       = $29,
      heroine_date                  = $30,
      ecstasy                       = $31,
      ecstasy_date                  = $32,
      pregabaline                   = $33,
      pregabaline_date              = $34,
      tramadol                      = $35,
      tramadol_date                 = $36,
      codeine                       = $37,
      codeine_date                  = $38,
      chicha                        = $39,
      cafeine_excessive             = $40,
      updated_by                    = $41,
      updated_at                    = NOW()
    FROM patients p
    WHERE hv.patient_id = p.id
      AND p.numero = $1
    RETURNING hv.*;
    `,
    [
      numero,
      tabagisme ?? false, alcoolemie ?? false, activite_physique ?? false,
      proteines ?? false, proteines_date ?? null,
      creatine ?? false, creatine_date ?? null,
      complements_vitaminiques ?? false, complements_vitaminiques_type ?? null, complements_vitaminiques_date ?? null,
      multivitamines ?? false, multivitamines_type ?? null, multivitamines_date ?? null,
      plantes_medicinales ?? false, plantes_medicinales_type ?? null, plantes_medicinales_date ?? null,
      autres_complements ?? false, autres_complements_type ?? null, autres_complements_date ?? null,
      drogues_injectables ?? false, drogues_injectables_date ?? null,
      cannabis ?? false, cannabis_date ?? null,
      cocaine ?? false, cocaine_date ?? null,
      crack ?? false, crack_date ?? null,
      heroine ?? false, heroine_date ?? null,
      ecstasy ?? false, ecstasy_date ?? null,
      pregabaline ?? false, pregabaline_date ?? null,
      tramadol ?? false, tramadol_date ?? null,
      codeine ?? false, codeine_date ?? null,
      chicha ?? false, cafeine_excessive ?? false,
      userId,
    ]
  );
  return result.rows[0] || null;
};