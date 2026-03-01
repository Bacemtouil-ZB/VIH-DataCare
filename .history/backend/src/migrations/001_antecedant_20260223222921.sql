-- Migration: Create antecedents table pivotal for patient history management
CREATE TABLE antecedents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,

    version_number INTEGER NOT NULL DEFAULT 1 CHECK (version_number >= 1),
    status TEXT NOT NULL CHECK (status IN ('active', 'archived')) DEFAULT 'active',

    created_by UUID NOT NULL REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    archived_by UUID REFERENCES users(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    archived_at TIMESTAMPTZ
);
-- Migration: Create antecedent_medical table to capture detailed medical history linked to antecedents
CREATE TABLE antecedent_medical (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    antecedent_id UUID UNIQUE NOT NULL
        REFERENCES antecedents(id) ON DELETE CASCADE,

    diabete BOOLEAN NOT NULL DEFAULT FALSE,
    hypertension BOOLEAN NOT NULL DEFAULT FALSE,
    cardiopathies BOOLEAN NOT NULL DEFAULT FALSE,
    insuffisance_renale BOOLEAN NOT NULL DEFAULT FALSE,
    maladies_hepatiques BOOLEAN NOT NULL DEFAULT FALSE,
    asthme_bpco BOOLEAN NOT NULL DEFAULT FALSE,
    cancers BOOLEAN NOT NULL DEFAULT FALSE,
    autres TEXT,

    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration: Create antecedent_infectious table to document infectious diseases in patient history linked to antecedents
CREATE TABLE antecedent_infectious (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    antecedent_id UUID UNIQUE NOT NULL
        REFERENCES antecedents(id) ON DELETE CASCADE,

    tuberculose BOOLEAN NOT NULL DEFAULT FALSE,
    hepatites_virales BOOLEAN NOT NULL DEFAULT FALSE,
    syphilis BOOLEAN NOT NULL DEFAULT FALSE,
    gonococcie BOOLEAN NOT NULL DEFAULT FALSE,
    chlamydia BOOLEAN NOT NULL DEFAULT FALSE,
    pneumocystose BOOLEAN NOT NULL DEFAULT FALSE,
    toxoplasmose BOOLEAN NOT NULL DEFAULT FALSE,
    candidoses_severes BOOLEAN NOT NULL DEFAULT FALSE,
    zona_recidivant BOOLEAN NOT NULL DEFAULT FALSE,

    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration: Create antecedent_therapeutic table to capture therapeutic history linked to antecedents
CREATE TABLE antecedent_therapeutic (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    antecedent_id UUID UNIQUE NOT NULL
        REFERENCES antecedents(id) ON DELETE CASCADE,

    medicaments_chroniques TEXT,
    automedication TEXT,
    medecines_traditionnelles TEXT,
    allergies_medicaments TEXT,

    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Migration: Create antecedent_surgical table to document surgical history linked to antecedents
CREATE TABLE antecedent_surgical (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    antecedent_id UUID NOT NULL
        REFERENCES antecedents(id) ON DELETE CASCADE,

    description TEXT,
    date_intervention DATE,

    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration: Create antecedent_transfusion table to record blood transfusion history linked to antecedents
CREATE TABLE antecedent_transfusion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    antecedent_id UUID NOT NULL
        REFERENCES antecedents(id) ON DELETE CASCADE,

    date_transfusion DATE,

    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);