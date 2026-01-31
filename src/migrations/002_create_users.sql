CREATE TYPE role_enum AS ENUM ('pharmacien', 'medecin', 'analyste','admin');

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role role_enum,  
  isActivated BOOLEAN DEFAULT false
);
