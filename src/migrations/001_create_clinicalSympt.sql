CREATE TABLE ClinicalSymptoms (
    clinisymptomsId SERIAL PRIMARY KEY,
    effectiveDateTime DATE,
    general_signs VARCHAR(100),
    dermatological_symptoms VARCHAR(100),
    digestive_symptoms VARCHAR(100),
    cardiovascular VARCHAR(100),
    genitourinary VARCHAR(100),
    lipodystrophy VARCHAR(100),
    neuro_osteo_muscular VARCHAR(100),
    ophthalmological VARCHAR(100),

);
