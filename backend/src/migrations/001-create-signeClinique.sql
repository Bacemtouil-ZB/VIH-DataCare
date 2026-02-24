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
CREATE TABLE autres_signes_cliniques (
    id SERIAL PRIMARY KEY,
    signes_cliniques_id INTEGER NOT NULL,
    appareil_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_autres_signes_cliniques 
        FOREIGN KEY (signes_cliniques_id) 
        REFERENCES signes_cliniques(id) 
        ON DELETE CASCADE,
        
    CONSTRAINT fk_autres_signes_appareil
        FOREIGN KEY (appareil_id)
        REFERENCES ref_appareil_fonctionnel(id)
        ON DELETE CASCADE
);