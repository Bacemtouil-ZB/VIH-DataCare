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
    'VIH_VIEW'
);

CREATE TABLE audit_logs (

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