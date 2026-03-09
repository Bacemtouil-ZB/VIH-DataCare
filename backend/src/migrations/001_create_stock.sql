CREATE TABLE IF NOT EXISTS stock_medicaments (
  id SERIAL PRIMARY KEY,
  code VARCHAR(30) NOT NULL UNIQUE,
  composition VARCHAR(255) NOT NULL,
  dosage VARCHAR(200)
  quantite INTEGER NOT NULL DEFAULT 0 CHECK (quantite >= 0),
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_medicaments_code ON stock_medicaments(code);

-- Insertion des médicaments dans la table stock_medicaments avec la colonne "dosage" à NULL

INSERT INTO stock_medicaments (code, composition, quantite, dosage, created_by, updated_by) VALUES
('TLD', 'Ténofovir (TDF)/Lamivudine (3TC)/Doltégravir (DTG)', 100, NULL, 1, 1),
('AVONZA', 'Ténofovir (TDF)/Lamivudine (3TC)/Efavirenz (EFV)', 100, NULL, 1, 1),
('COMBIVIR', 'Zidovudine (AZT)/Lamivudine (3TC)', 100, NULL, 1, 1),
('REYATAZ/RITONAVIR', 'Atazanavir (ATV)/Ritonavir (RTV)', 100, NULL, 1, 1),
('KIVEXA', 'Abacavir (ABC)/Lamivudine (3TC)', 100, NULL, 1, 1),
('PREZISTA/RITONAVIR', 'Darunavir (DRV)/Ritonavir (RTV)', 100, NULL, 1, 1),
('TRUVADA', 'Ténofovir (TDF)/Emtricitabine (FTC)', 100, NULL, 1, 1),
('ZIAGEN', 'Abacavir (ABC)', 100, NULL, 1, 1),
('DTG', 'Dolutegravir (DTG)', 100, NULL, 1, 1);