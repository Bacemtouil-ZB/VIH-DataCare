-- =============================================================================
-- CREATE TABLES: Antecedents
-- =============================================================================

-- -----------------------------------------------------------------------------
-- antecedent_medical (1-1)
-- -----------------------------------------------------------------------------
CREATE TABLE public.antecedent_medical (
    id                  SERIAL PRIMARY KEY,
    patient_id          INTEGER NOT NULL,
    diabete             BOOLEAN NOT NULL DEFAULT false,
    hypertension        BOOLEAN NOT NULL DEFAULT false,
    cardiopathies       BOOLEAN NOT NULL DEFAULT false,
    insuffisance_renale BOOLEAN NOT NULL DEFAULT false,
    maladies_hepatiques BOOLEAN NOT NULL DEFAULT false,
    asthme_bpco         BOOLEAN NOT NULL DEFAULT false,
    cancers             BOOLEAN NOT NULL DEFAULT false,
    autres              TEXT,
    remarque            TEXT,
    created_by          INTEGER NOT NULL,
    updated_by          INTEGER,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT antecedent_medical_patient_id_key
        UNIQUE (patient_id),
    CONSTRAINT antecedent_medical_patient_id_fkey
        FOREIGN KEY (patient_id) REFERENCES public.patients (id)
        ON DELETE RESTRICT,
    CONSTRAINT antecedent_medical_created_by_fkey
        FOREIGN KEY (created_by) REFERENCES public.users (id),
    CONSTRAINT antecedent_medical_updated_by_fkey
        FOREIGN KEY (updated_by) REFERENCES public.users (id)
);

CREATE INDEX antecedent_medical_patient_id_idx
    ON public.antecedent_medical (patient_id);

-- -----------------------------------------------------------------------------
-- antecedent_therapeutic (1-1)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.antecedent_therapeutic
(
    id                      SERIAL,
    patient_id              INTEGER,
    medicaments_chroniques  TEXT,
    allergies_medicaments   TEXT,
    remarque                TEXT,
    created_by              INTEGER,
    updated_by              INTEGER,
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at              TIMESTAMP WITH TIME ZONE DEFAULT now(),

    CONSTRAINT antecedent_therapeutic_pkey PRIMARY KEY (id),
    CONSTRAINT antecedent_therapeutic_patient_id_key UNIQUE (patient_id),
    CONSTRAINT antecedent_therapeutic_created_by_fkey FOREIGN KEY (created_by)
        REFERENCES public.users (id) ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT antecedent_therapeutic_patient_id_fkey FOREIGN KEY (patient_id)
        REFERENCES public.patients (id) ON UPDATE NO ACTION ON DELETE RESTRICT,
    CONSTRAINT antecedent_therapeutic_updated_by_fkey FOREIGN KEY (updated_by)
        REFERENCES public.users (id) ON UPDATE NO ACTION ON DELETE NO ACTION
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.antecedent_therapeutic OWNER TO postgres;

CREATE INDEX IF NOT EXISTS antecedent_therapeutic_patient_id_idx
    ON public.antecedent_therapeutic USING btree
    (patient_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- -----------------------------------------------------------------------------
-- antecedent_family (1-1)
-- -----------------------------------------------------------------------------
CREATE TABLE public.antecedent_family (
    id                  SERIAL PRIMARY KEY,
    patient_id          INTEGER NOT NULL,
    diabete             BOOLEAN NOT NULL DEFAULT false,
    hypertension        BOOLEAN NOT NULL DEFAULT false,
    cardiopathies       BOOLEAN NOT NULL DEFAULT false,
    insuffisance_renale BOOLEAN NOT NULL DEFAULT false,
    maladies_hepatiques BOOLEAN NOT NULL DEFAULT false,
    asthme_bpco         BOOLEAN NOT NULL DEFAULT false,
    cancers             BOOLEAN NOT NULL DEFAULT false,
    autres              TEXT,
    remarque            TEXT,
    created_by          INTEGER NOT NULL,
    updated_by          INTEGER,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT antecedent_family_patient_id_key
        UNIQUE (patient_id),
    CONSTRAINT antecedent_family_patient_id_fkey
        FOREIGN KEY (patient_id) REFERENCES public.patients (id)
        ON DELETE RESTRICT,
    CONSTRAINT antecedent_family_created_by_fkey
        FOREIGN KEY (created_by) REFERENCES public.users (id),
    CONSTRAINT antecedent_family_updated_by_fkey
        FOREIGN KEY (updated_by) REFERENCES public.users (id)
);

CREATE INDEX antecedent_family_patient_id_idx
    ON public.antecedent_family (patient_id);

-- -----------------------------------------------------------------------------
-- antecedent_gyneco (1-1)
-- -----------------------------------------------------------------------------
CREATE TABLE public.antecedent_gyneco (
    id                   SERIAL PRIMARY KEY,
    patient_id           INTEGER NOT NULL,
    gestite              INTEGER CHECK (gestite >= 0),
    parite               INTEGER CHECK (parite >= 0),
    avortement           INTEGER CHECK (avortement >= 0),
    complications        TEXT,
    suivi_gynecologique  TEXT,
    depistage_cancer_col TEXT,
    remarque             TEXT,
    created_by           INTEGER NOT NULL,
    updated_by           INTEGER,
    created_at           TIMESTAMPTZ DEFAULT NOW(),
    updated_at           TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT antecedent_gyneco_patient_id_key
        UNIQUE (patient_id),
    CONSTRAINT antecedent_gyneco_patient_id_fkey
        FOREIGN KEY (patient_id) REFERENCES public.patients (id)
        ON DELETE RESTRICT,
    CONSTRAINT antecedent_gyneco_created_by_fkey
        FOREIGN KEY (created_by) REFERENCES public.users (id),
    CONSTRAINT antecedent_gyneco_updated_by_fkey
        FOREIGN KEY (updated_by) REFERENCES public.users (id),
    CONSTRAINT antecedent_gyneco_gestite_check
        CHECK (gestite IS NULL OR
              (COALESCE(parite, 0) + COALESCE(avortement, 0)) <= gestite)
);

CREATE INDEX antecedent_gyneco_patient_id_idx
    ON public.antecedent_gyneco (patient_id);

-- -----------------------------------------------------------------------------
-- antecedent_surgical (1-N)
-- -----------------------------------------------------------------------------
CREATE TABLE public.antecedent_surgical (
    id                SERIAL PRIMARY KEY,
    patient_id        INTEGER NOT NULL,
    description       TEXT,
    date_intervention DATE,
    remarque          TEXT,
    created_by        INTEGER NOT NULL,
    created_at        TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT antecedent_surgical_patient_id_fkey
        FOREIGN KEY (patient_id) REFERENCES public.patients (id)
        ON DELETE RESTRICT,
    CONSTRAINT antecedent_surgical_created_by_fkey
        FOREIGN KEY (created_by) REFERENCES public.users (id)
);

CREATE INDEX antecedent_surgical_patient_id_idx
    ON public.antecedent_surgical (patient_id);

-- -----------------------------------------------------------------------------
-- antecedent_transfusion (1-N)
-- -----------------------------------------------------------------------------
CREATE TABLE public.antecedent_transfusion (
    id               SERIAL PRIMARY KEY,
    patient_id       INTEGER NOT NULL,
    date_transfusion DATE,
    remarque         TEXT,
    created_by       INTEGER NOT NULL,
    created_at       TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT antecedent_transfusion_patient_id_fkey
        FOREIGN KEY (patient_id) REFERENCES public.patients (id)
        ON DELETE RESTRICT,
    CONSTRAINT antecedent_transfusion_created_by_fkey
        FOREIGN KEY (created_by) REFERENCES public.users (id)
);

CREATE INDEX antecedent_transfusion_patient_id_idx
    ON public.antecedent_transfusion (patient_id);

-- -----------------------------------------------------------------------------
-- antecedent_tpe_prep (1-N)
-- -----------------------------------------------------------------------------
CREATE TABLE public.antecedent_tpe_prep (
    id                  SERIAL PRIMARY KEY,
    patient_id          INTEGER NOT NULL,
    tpe_nom_traitement  TEXT,
    tpe_date            DATE,
    prep_nom_traitement TEXT,
    prep_date           DATE,
    remarque            TEXT,
    created_by          INTEGER NOT NULL,
    created_at          TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT antecedent_tpe_prep_patient_id_fkey
        FOREIGN KEY (patient_id) REFERENCES public.patients (id)
        ON DELETE RESTRICT,
    CONSTRAINT antecedent_tpe_prep_created_by_fkey
        FOREIGN KEY (created_by) REFERENCES public.users (id)
);

CREATE INDEX antecedent_tpe_prep_patient_id_idx
    ON public.antecedent_tpe_prep (patient_id);
-----------------------------------
-------habitude de vie (1-1)
------------------------------------
CREATE TABLE IF NOT EXISTS public.habitudes_vie
(
    id                            SERIAL PRIMARY KEY,
 
    -- Habitudes de base
    tabagisme                     BOOLEAN DEFAULT false,
    alcoolemie                    BOOLEAN DEFAULT false,
    activite_physique             BOOLEAN DEFAULT false,
 
    -- Compléments alimentaires / Vitamines
    proteines                     BOOLEAN DEFAULT false,
    proteines_date                DATE,
    creatine                      BOOLEAN DEFAULT false,
    creatine_date                 DATE,
    complements_vitaminiques      BOOLEAN DEFAULT false,
    complements_vitaminiques_type VARCHAR(255),
    complements_vitaminiques_date DATE,
    multivitamines                BOOLEAN DEFAULT false,
    multivitamines_type           VARCHAR(255),
    multivitamines_date           DATE,
    plantes_medicinales           BOOLEAN DEFAULT false,
    plantes_medicinales_type      VARCHAR(255),
    plantes_medicinales_date      DATE,
    autres_complements            BOOLEAN DEFAULT false,
    autres_complements_type       VARCHAR(255),
    autres_complements_date       DATE,
 
    -- Autres consommations
    drogues_injectables           BOOLEAN DEFAULT false,
    drogues_injectables_date      DATE,
    cannabis                      BOOLEAN DEFAULT false,
    cannabis_date                 DATE,
    cocaine                       BOOLEAN DEFAULT false,
    cocaine_date                  DATE,
    crack                         BOOLEAN DEFAULT false,
    crack_date                    DATE,
    heroine                       BOOLEAN DEFAULT false,
    heroine_date                  DATE,
    ecstasy                       BOOLEAN DEFAULT false,
    ecstasy_date                  DATE,
    pregabaline                   BOOLEAN DEFAULT false,
    pregabaline_date              DATE,
    tramadol                      BOOLEAN DEFAULT false,
    tramadol_date                 DATE,
    codeine                       BOOLEAN DEFAULT false,
    codeine_date                  DATE,
    chicha                        BOOLEAN DEFAULT false,
    cafeine_excessive             BOOLEAN DEFAULT false,
 
    -- Audit
    created_by                    INTEGER,
    updated_by                    INTEGER,
    created_at                    TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at                    TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
 
    CONSTRAINT habitudes_vie_created_by_fkey FOREIGN KEY (created_by)
        REFERENCES public.users (id) ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT habitudes_vie_updated_by_fkey FOREIGN KEY (updated_by)
        REFERENCES public.users (id) ON UPDATE NO ACTION ON DELETE NO ACTION
)

//pour habitude de vie 
ALTER TABLE public.habitudes_vie 
  ADD COLUMN patient_id INTEGER;

ALTER TABLE public.habitudes_vie 
  ADD CONSTRAINT habitudes_vie_patient_id_fkey 
  FOREIGN KEY (patient_id) REFERENCES public.patients (id) ON DELETE RESTRICT;

ALTER TABLE public.habitudes_vie 
  ADD CONSTRAINT habitudes_vie_patient_id_key 
  UNIQUE (patient_id);

CREATE INDEX habitudes_vie_patient_id_idx 
  ON public.habitudes_vie (patient_id);