-- Table contacts d'urgence
CREATE TABLE emergency_contacts (
  id          SERIAL PRIMARY KEY,
  nom         VARCHAR(150) NOT NULL,
  telephone   VARCHAR(20),
  whatsapp    VARCHAR(20),
  email       VARCHAR(150),
  description TEXT,
  created_by  INTEGER NOT NULL REFERENCES users(id),
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);