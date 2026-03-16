CREATE TABLE examen_clinique (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    date_examen TIMESTAMP NOT NULL,
    medecin_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_examen_patient 
        FOREIGN KEY (patient_id) 
        REFERENCES patients(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_examen_medecin
        FOREIGN KEY (medecin_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);
