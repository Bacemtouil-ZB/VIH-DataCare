CREATE TABLE habitudes_vie (
    id SERIAL PRIMARY KEY,
    examen_clinique_id INTEGER NOT NULL,
    alcool BOOLEAN DEFAULT FALSE,
    tabac BOOLEAN DEFAULT FALSE,
    drogue BOOLEAN DEFAULT FALSE,
    activite_physique BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_habitudes_examen 
        FOREIGN KEY (examen_clinique_id) 
        REFERENCES examen_clinique(id) 
        ON DELETE CASCADE
);