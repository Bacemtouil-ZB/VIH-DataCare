CREATE TYPE role_enum AS ENUM ('admin', 'pharmacien', 'medecin', 'analyste');

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(50) NOT NULL,
  prenom VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role role_enum  ,
  isactivated BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

/**
INSERT INTO users (nom, prenom, email, password, role, isactivated)
VALUES (
  'Admin',
  'Système',
  'admin@system.com',
  '$2a$10$XQj9fP0FqVGvVHJ7xC3DP.xmNfxYVZ0VqvPxQRK8bJKHZLMYJKx5C',
  'admin',
  true
)
**/