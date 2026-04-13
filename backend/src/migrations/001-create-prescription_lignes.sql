CREATE TABLE IF NOT EXISTS prescription_lignes (
  id                       SERIAL PRIMARY KEY,
  prescription_id          INTEGER NOT NULL 
                           REFERENCES prescription_medicale(id) ON DELETE CASCADE,
  medicament_id            INTEGER 
                           REFERENCES stock_medicaments(id) ON DELETE SET NULL,
  medicament_nom_snapshot  VARCHAR(255) NOT NULL,
  created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);