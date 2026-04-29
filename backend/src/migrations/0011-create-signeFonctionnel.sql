
CREATE TABLE IF NOT EXISTS signes_fonctionnels (
    id SERIAL PRIMARY KEY,
    examen_clinique_id INTEGER NOT NULL,
    fievre BOOLEAN DEFAULT FALSE,
    toux BOOLEAN DEFAULT FALSE,
    dyspnee BOOLEAN DEFAULT FALSE,
    sueurs_nocturnes BOOLEAN DEFAULT FALSE,
    cephalee BOOLEAN DEFAULT FALSE,
    rhinorrhee BOOLEAN DEFAULT FALSE,
    troubles_visuels BOOLEAN DEFAULT FALSE,
    diarrhee BOOLEAN DEFAULT FALSE,
    douleurs_abdomen BOOLEAN DEFAULT FALSE,
    nausees BOOLEAN DEFAULT FALSE,
    dysphagie BOOLEAN DEFAULT FALSE,
    prurit BOOLEAN DEFAULT FALSE,
    paresthesie BOOLEAN DEFAULT FALSE,
    myalgie BOOLEAN DEFAULT FALSE,
    arthralgie BOOLEAN DEFAULT FALSE,
    anorexie BOOLEAN DEFAULT FALSE,
    insomnie BOOLEAN DEFAULT FALSE,
    troubles_humeur BOOLEAN DEFAULT FALSE,
    asthenie BOOLEAN DEFAULT FALSE,
    crampes BOOLEAN DEFAULT FALSE,
    troubles_libido BOOLEAN DEFAULT FALSE,
    ras BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_signes_fonctionnels_examen 
        FOREIGN KEY (examen_clinique_id) 
        REFERENCES examen_clinique(id) 
        ON DELETE CASCADE,
        
);



CREATE TABLE ref_appareil_fonctionnel (
    id SERIAL PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL,
    ordre INTEGER NOT NULL
);


-- Insertion des appareils
INSERT INTO ref_appareil_fonctionnel (libelle, ordre) VALUES
('Signes Généraux', 1),
('Cardiovasculaire', 2),
('Dermatologique', 3),
('Digestif', 4),
('Génito-Urinaire', 5),
('Neurologie', 6),
('ORL', 7),
('Ophtalmologique', 8),
('Pleuro-Pulmonaire', 9),
('Psychiatrique', 10);



CREATE TABLE autres_signes_fonctionnels (
    id SERIAL PRIMARY KEY,
    signes_fonctionnels_id INTEGER NOT NULL,
    appareil_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_autres_signes_fonctionnels 
        FOREIGN KEY (signes_fonctionnels_id) 
        REFERENCES signes_fonctionnels(id) 
        ON DELETE CASCADE,
        
    CONSTRAINT fk_autres_signes_appareil
        FOREIGN KEY (appareil_id)
        REFERENCES ref_appareil_fonctionnel(id)
        ON DELETE CASCADE
);


