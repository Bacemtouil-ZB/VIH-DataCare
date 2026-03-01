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