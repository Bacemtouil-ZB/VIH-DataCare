CREATE TABLE governorates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE postal_codes (
    id SERIAL PRIMARY KEY,
    governorate_id INTEGER NOT NULL 
        REFERENCES governorates(id)
        ON DELETE CASCADE,
    code CHAR(4) NOT NULL UNIQUE
        CHECK (code ~ '^[0-9]{4}$')
);
