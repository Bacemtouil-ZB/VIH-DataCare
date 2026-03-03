CREATE TABLE patients (
  id SERIAL PRIMARY KEY,

  numero VARCHAR(100) UNIQUE NOT NULL,

  name VARCHAR(100) NOT NULL,
  surname VARCHAR(100) NOT NULL,
  birthdate DATE NOT NULL,

  gender VARCHAR(20)
      CHECK (gender IN ('homme', 'femme')),

  birth_address_id INTEGER
      REFERENCES addresses(id),

  residence_address_id INTEGER
      REFERENCES addresses(id),

  phone VARCHAR(20) NOT NULL,

  hospitalisation VARCHAR(20) NOT NULL
      CHECK (hospitalisation IN ('interne', 'externe')),

  status VARCHAR(100),

  remarks TEXT,

  doctor_id INTEGER
      REFERENCES users(id)
      ON DELETE SET NULL,

  created_by INTEGER REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);