CREATE TABLE observations (
    id                 SERIAL PRIMARY KEY,
    examen_clinique_id INTEGER NOT NULL,
    remarque           TEXT    NOT NULL,
    created_at         TIMESTAMP DEFAULT NOW(),
    updated_at         TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_observations_examen
        FOREIGN KEY (examen_clinique_id)
        REFERENCES examen_clinique(id)
        ON DELETE CASCADE
);