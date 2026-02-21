CREATE TABLE signes_cliniques (
    id SERIAL PRIMARY KEY,
    examen_clinique_id INTEGER NOT NULL,
    poids DECIMAL(5,2),
    taille DECIMAL(5,2),
    imc DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_signes_cliniques_examen 
        FOREIGN KEY (examen_clinique_id) 
        REFERENCES examen_clinique(id) 
        ON DELETE CASCADE
);