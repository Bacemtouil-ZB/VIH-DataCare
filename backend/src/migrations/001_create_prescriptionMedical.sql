CREATE TABLE IF NOT EXISTS prescription_medicale (
  id             SERIAL PRIMARY KEY,
  patient_id     INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  medicament_id  INTEGER REFERENCES stock_medicaments(id) ON DELETE SET NULL,
  traitement     VARCHAR(255) NOT NULL,
  posologie      VARCHAR(255) NOT NULL,
  dosage         VARCHAR(255),
  date           DATE         NOT NULL,
  quantite       INTEGER  NOT NULL CHECK (quantite > 0),
    --statut pour l envoie de la prescription a la pharmacie
  remarque       TEXT,
  created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

