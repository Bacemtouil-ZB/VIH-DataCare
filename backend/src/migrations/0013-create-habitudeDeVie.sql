
CREATE TABLE IF NOT EXISTS habitudes_vie (
  id SERIAL PRIMARY KEY,
  examen_clinique_id INTEGER NOT NULL REFERENCES examen_clinique(id) ON DELETE CASCADE,
  tabagisme BOOLEAN DEFAULT FALSE NOT NULL,
  alcoolemie BOOLEAN DEFAULT FALSE NOT NULL,
  toxicomanie BOOLEAN DEFAULT FALSE NOT NULL,
  activite_physique BOOLEAN DEFAULT FALSE NOT NULL,
  created_by INTEGER REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_habitude_examen UNIQUE(examen_clinique_id)
);

