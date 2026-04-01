-- ── Table resultats_biologiques ───────────────────────────────────────────────
-- Stocke tous les champs possibles — NULL si bilan non prescrit
-- Colonnes alignées sur les clés de bilanResultatsMap.js
CREATE TABLE IF NOT EXISTS resultats_biologiques (
  id          SERIAL PRIMARY KEY,
  patient_id  INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  bilan_id    INTEGER REFERENCES bilan_examens(id) ON DELETE SET NULL,

  -- Sérologie VIH  →  key: "serologie_vih"
  serologie_vih      VARCHAR(20),

  -- Bilan biochimique  →  keys: asat, alat, phosphore, calcemie, creatinine
  asat        NUMERIC, alat        NUMERIC,
  phosphore   NUMERIC, calcemie    NUMERIC, creatinine  NUMERIC,

  -- Sérologie VHB  →  keys: vhb_ag_hbs, vhb_ac_hbs, vhb_ac_hbc
  vhb_ag_hbs  VARCHAR(20), vhb_ac_hbs VARCHAR(20), vhb_ac_hbc VARCHAR(20),

  -- NFS complète  →  keys: hemoglobine, plaquettes, globules_blancs, lymphocytes
  hemoglobine     NUMERIC, plaquettes      NUMERIC,
  globules_blancs NUMERIC, lymphocytes     NUMERIC,

  -- Charge virale VIH  →  key: charge_virale_valeur
  charge_virale_valeur NUMERIC,

  -- CD4/CD8  →  keys: cd4_absolu, cd4_pourcent
  cd4_absolu   NUMERIC, cd4_pourcent NUMERIC,

  -- Bilan lipidique  →  keys: cholesterol_total, hdl, ldl, triglycerides
  cholesterol_total NUMERIC, hdl NUMERIC, ldl NUMERIC, triglycerides NUMERIC,

  -- Sérologie VHA  →  key: vha_igg
  vha_igg VARCHAR(20),

  -- Sérologie VHC  →  key: vhc
  vhc VARCHAR(20),

  -- Sérologie syphilis  →  keys: vdrl, tpha  (minuscules, sans guillemets)
  vdrl VARCHAR(20), tpha VARCHAR(20),

  -- Sérologie toxoplasmose  →  keys: toxo_igm, toxo_igg
  toxo_igm VARCHAR(20), toxo_igg VARCHAR(20),

  -- Sérologie CMV  →  keys: cmv_igm, cmv_igg
  cmv_igm VARCHAR(20), cmv_igg VARCHAR(20),

  -- Sérologie leishmaniose  →  key: leishmania_ac
  -- (leishmania_titre supprimé : absent de bilanResultatsMap.js)
  leishmania_ac VARCHAR(20),

  -- IDR à la tuberculine  →  key: idr_tuberculine
  idr_tuberculine VARCHAR(20),

  -- Radio thorax  →  keys: radio_resultat, radio_description
  radio_resultat    VARCHAR(30), radio_description TEXT,


  -- ── Dates par section (hasDate: true dans bilanResultatsMap.js) ────────────
  date_serologie_vih           DATE,
  date_bilan_biochimique       DATE,
  date_serologie_vhb           DATE,
  date_nfs_complete            DATE,
  date_charge_virale_vih       DATE,
  date_cd4_cd8                 DATE,
  date_bilan_lipidique         DATE,
  date_serologie_vha           DATE,
  date_serologie_vhc           DATE,
  date_serologie_syphilis      DATE,
  date_serologie_toxoplasmose  DATE,
  date_serologie_cmv           DATE,
  date_serologie_leishmaniose  DATE,
  date_idr_tuberculine         DATE,
  date_radio_thorax            DATE,


  -- Observations
  observations TEXT,

  date_resultat DATE DEFAULT CURRENT_DATE,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- Enum audit
ALTER TYPE action_enum ADD VALUE IF NOT EXISTS 'RESULTAT_BIOLOGIQUE_CREATE';
ALTER TYPE action_enum ADD VALUE IF NOT EXISTS 'RESULTAT_BIOLOGIQUE_VIEW';
ALTER TYPE action_enum ADD VALUE IF NOT EXISTS 'RESULTAT_BIOLOGIQUE_UPDATE';