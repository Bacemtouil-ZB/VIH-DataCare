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


CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

--for mobile app
ALTER TABLE users 
ADD COLUMN must_change_password BOOLEAN DEFAULT false;

ALTER TABLE users 
ADD COLUMN username VARCHAR(100) UNIQUE; -- don't touch email for web app, add username for mobile app

--nom et prenom ne sont pas obligatoires pour les utilisateurs de l'application mobile, donc on les rend optionnels 
ALTER TABLE users ALTER COLUMN nom DROP NOT NULL;
ALTER TABLE users ALTER COLUMN prenom DROP NOT NULL;