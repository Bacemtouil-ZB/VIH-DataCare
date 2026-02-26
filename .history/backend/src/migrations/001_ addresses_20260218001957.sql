CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    
    governorate VARCHAR(50) NOT NULL,   -- ex: Tunis, Sousse
    code_postal CHAR(4) NOT NULL,       -- ex: 1000, 2070

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT unique_address UNIQUE(governorate, code_postal)
);
