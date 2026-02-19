CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    numero_dossier VARCHAR(15) UNIQUE NOT NULL,
    hospitalisation VARCHAR(10) CHECK (hospitalisation IN ('interne', 'externe')) NOT NULL,
    
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    birthdate DATE NOT NULL,
    gender CHAR(1) CHECK (gender IN ('H','F')) NOT NULL,
    phone CHAR(8) NOT NULL,

    birth_address_id INT REFERENCES addresses(id) ON DELETE SET NULL,
    residence_address_id INT REFERENCES addresses(id) ON DELETE SET NULL,
    exact_address TEXT,                  -- adresse exacte (rue, porte…)

    doctor_id INT REFERENCES users(id) ON DELETE SET NULL,
    remarques TEXT,

    created_by_name VARCHAR(50),
    updated_by_name VARCHAR(50),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);
