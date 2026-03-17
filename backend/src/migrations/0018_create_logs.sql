
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_enum') THEN
        CREATE TYPE role_enum AS ENUM (
            'admin',
            'medecin',
            'analyste',
            'pharmacien'
            
        );
    END IF;
END $$;


-- Créer l'ENUM seulement s'il n'existe pas déjà
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'action_enum') THEN
        CREATE TYPE action_enum AS ENUM (
            'LOGIN_SUCCESS',
            'LOGIN_FAILED',

            'PATIENT_CREATE',
            'PATIENT_UPDATE',
            'PATIENT_VIEW',

            'SOCIAL_CREATE',
            'SOCIAL_UPDATE',
            'SOCIAL_VIEW',

            'VIH_CREATE',
            'VIH_UPDATE',
            'VIH_VIEW',

            'EXAMEN_CLINIQUE_CREATE',
            'EXAMEN_CLINIQUE_UPDATE',
            'EXAMEN_CLINIQUE_VIEW',

            'OBSERVATION_CREATE',
            'OBSERVATION_UPDATE',
            'OBSERVATION_VIEW',

            'HABITUDE_DE_VIE_CREATE',
            'HABITUDE_DE_VIE_UPDATE',
            'HABITUDE_DE_VIE_VIEW',
            
            'SIGNE_CLINIQUE_VIEW',
            'SIGNE_CLINIQUE_UPDATE',
            'SIGNE_CLINIQUE_CREATE',

            'SIGNE_FONCTIONNEL_VIEW',
            'SIGNE_FONCTIONNEL_UPDATE',
            'SIGNE_FONCTIONNEL_CREATE',

            'STOCK_CREATE',
            'STOCK_UPDATE',
            'STOCK_VIEW',
            'STOCK_DELETE',

            'RENDEZ_VOUS_CREATE',
            'RENDEZ_VOUS_UPDATE',
            'RENDEZ_VOUS_VIEW',
            
            'PRESCRIPTION_MEDICALE_CREATE',
            'PRESCRIPTION_MEDICALE_VIEW',
            'PRESCRIPTION_MEDICALE_UPDATE'
        );
    END IF;
END $$;

-- Créer la table audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    request_id UUID,
    session_id VARCHAR(255),
    user_id INTEGER REFERENCES users(id),
    user_role role_enum,
    patient_id INTEGER REFERENCES patients(id) ON DELETE SET NULL,
    module VARCHAR(50),
    action action_enum NOT NULL,
    entity_id INTEGER,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(100),
    user_agent TEXT,
    is_anomaly BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Créer les index seulement s'ils n'existent pas
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_patient ON audit_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_date ON audit_logs(created_at);