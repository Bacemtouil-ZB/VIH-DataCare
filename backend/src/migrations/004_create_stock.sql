CREATE TABLE IF NOT EXISTS stock_medicaments (
  id SERIAL PRIMARY KEY,
  code VARCHAR(30) NOT NULL UNIQUE,
  composition VARCHAR(255) NOT NULL,
  quantite INTEGER NOT NULL DEFAULT 0 CHECK (quantite >= 0),
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_medicaments_code ON stock_medicaments(code);

