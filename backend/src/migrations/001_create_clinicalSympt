-- ========================================
-- TABLES PRINCIPALES
-- ========================================

CREATE TABLE examen_clinique (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    date_examen TIMESTAMP NOT NULL,
    medecin_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_examen_patient 
        FOREIGN KEY (patient_id) 
        REFERENCES patients(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_examen_medecin
        FOREIGN KEY (medecin_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE INDEX idx_examen_patient ON examen_clinique(patient_id);
CREATE INDEX idx_examen_date ON examen_clinique(date_examen);
CREATE INDEX idx_examen_medecin ON examen_clinique(medecin_id);

-- ========================================
-- SIGNES CLINIQUES (Mesures physiques)
-- ========================================

CREATE TABLE signes_cliniques (
    id SERIAL PRIMARY KEY,
    examen_clinique_id INTEGER NOT NULL,
    poids DECIMAL(5,2),
    taille DECIMAL(5,2),
    imc DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_signes_cliniques_examen 
        FOREIGN KEY (examen_clinique_id) 
        REFERENCES examen_clinique(id) 
        ON DELETE CASCADE
);

CREATE INDEX idx_signes_cliniques_examen ON signes_cliniques(examen_clinique_id);

-- ========================================
-- SIGNES FONCTIONNELS (Symptômes courants)
-- ========================================

CREATE TABLE signes_fonctionnels (
    id SERIAL PRIMARY KEY,
    examen_clinique_id INTEGER NOT NULL,
    fievre BOOLEAN DEFAULT FALSE,
    toux BOOLEAN DEFAULT FALSE,
    dyspnee BOOLEAN DEFAULT FALSE,
    sueurs_nocturnes BOOLEAN DEFAULT FALSE,
    cephalee BOOLEAN DEFAULT FALSE,
    rhinorrhee BOOLEAN DEFAULT FALSE,
    troubles_visuels BOOLEAN DEFAULT FALSE,
    diarrhee BOOLEAN DEFAULT FALSE,
    douleurs_abdomen BOOLEAN DEFAULT FALSE,
    nausees BOOLEAN DEFAULT FALSE,
    dysphagie BOOLEAN DEFAULT FALSE,
    prurit BOOLEAN DEFAULT FALSE,
    paresthesie BOOLEAN DEFAULT FALSE,
    myalgie BOOLEAN DEFAULT FALSE,
    arthralgie BOOLEAN DEFAULT FALSE,
    anorexie BOOLEAN DEFAULT FALSE,
    insomnie BOOLEAN DEFAULT FALSE,
    troubles_humeur BOOLEAN DEFAULT FALSE,
    asthenie BOOLEAN DEFAULT FALSE,
    crampes BOOLEAN DEFAULT FALSE,
    troubles_libido BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_signes_fonctionnels_examen 
        FOREIGN KEY (examen_clinique_id) 
        REFERENCES examen_clinique(id) 
        ON DELETE CASCADE
);

CREATE INDEX idx_signes_fonctionnels_examen ON signes_fonctionnels(examen_clinique_id);

-- ========================================
-- TABLES DE RÉFÉRENCE POUR APPAREILS
-- ========================================

-- Appareils pour signes cliniques
CREATE TABLE ref_appareil_clinique (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    libelle VARCHAR(100) NOT NULL,
    ordre INTEGER NOT NULL,
    actif BOOLEAN DEFAULT TRUE
);

-- Appareils pour signes fonctionnels
CREATE TABLE ref_appareil_fonctionnel (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    libelle VARCHAR(100) NOT NULL,
    ordre INTEGER NOT NULL,
    actif BOOLEAN DEFAULT TRUE
);

-- ========================================
-- TABLES DE RÉFÉRENCE POUR SIGNES
-- ========================================

-- Signes cliniques par appareil
CREATE TABLE ref_signe_clinique (
    id SERIAL PRIMARY KEY,
    appareil_id INTEGER NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    libelle VARCHAR(200) NOT NULL,
    ordre INTEGER NOT NULL,
    actif BOOLEAN DEFAULT TRUE,
    
    CONSTRAINT fk_ref_signe_clinique_appareil
        FOREIGN KEY (appareil_id)
        REFERENCES ref_appareil_clinique(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_ref_signe_clinique_appareil ON ref_signe_clinique(appareil_id);

-- Signes fonctionnels par appareil
CREATE TABLE ref_signe_fonctionnel (
    id SERIAL PRIMARY KEY,
    appareil_id INTEGER NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    libelle VARCHAR(200) NOT NULL,
    ordre INTEGER NOT NULL,
    actif BOOLEAN DEFAULT TRUE,
    
    CONSTRAINT fk_ref_signe_fonctionnel_appareil
        FOREIGN KEY (appareil_id)
        REFERENCES ref_appareil_fonctionnel(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_ref_signe_fonctionnel_appareil ON ref_signe_fonctionnel(appareil_id);

-- ========================================
-- AUTRES SIGNES CLINIQUES (Détails)
-- ========================================

CREATE TABLE autres_signes_cliniques (
    id SERIAL PRIMARY KEY,
    signes_cliniques_id INTEGER NOT NULL,
    signe_id INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_autres_signes_cliniques_parent
        FOREIGN KEY (signes_cliniques_id) 
        REFERENCES signes_cliniques(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_autres_signes_cliniques_ref
        FOREIGN KEY (signe_id)
        REFERENCES ref_signe_clinique(id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_autres_signes_cliniques_parent ON autres_signes_cliniques(signes_cliniques_id);
CREATE INDEX idx_autres_signes_cliniques_signe ON autres_signes_cliniques(signe_id);

-- ========================================
-- SIGNES FONCTIONNELS DÉTAILS
-- ========================================

CREATE TABLE signes_fonctionnels_details (
    id SERIAL PRIMARY KEY,
    signes_fonctionnels_id INTEGER NOT NULL,
    signe_id INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_signes_fonctionnels_details_parent
        FOREIGN KEY (signes_fonctionnels_id) 
        REFERENCES signes_fonctionnels(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_signes_fonctionnels_details_ref
        FOREIGN KEY (signe_id)
        REFERENCES ref_signe_fonctionnel(id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_signes_fonctionnels_details_parent ON signes_fonctionnels_details(signes_fonctionnels_id);
CREATE INDEX idx_signes_fonctionnels_details_signe ON signes_fonctionnels_details(signe_id);

-- ========================================
-- OBSERVATIONS ET HABITUDES
-- ========================================

CREATE TABLE observations (
    id SERIAL PRIMARY KEY,
    examen_clinique_id INTEGER NOT NULL,
    date_observation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    commentaire TEXT,
    medecin_traitant_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_observations_examen 
        FOREIGN KEY (examen_clinique_id) 
        REFERENCES examen_clinique(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_observations_medecin
        FOREIGN KEY (medecin_traitant_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE INDEX idx_observations_examen ON observations(examen_clinique_id);
CREATE INDEX idx_observations_date ON observations(date_observation);

CREATE TABLE habitudes_vie (
    id SERIAL PRIMARY KEY,
    examen_clinique_id INTEGER NOT NULL,
    alcool BOOLEAN DEFAULT FALSE,
    tabac BOOLEAN DEFAULT FALSE,
    drogue BOOLEAN DEFAULT FALSE,
    activite_physique BOOLEAN DEFAULT FALSE,
    regime_alimentaire VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_habitudes_examen 
        FOREIGN KEY (examen_clinique_id) 
        REFERENCES examen_clinique(id) 
        ON DELETE CASCADE
);

CREATE INDEX idx_habitudes_examen ON habitudes_vie(examen_clinique_id);

-- ========================================
-- DONNÉES DE RÉFÉRENCE - APPAREILS FONCTIONNELS
-- ========================================

INSERT INTO ref_appareil_fonctionnel (code, libelle, ordre) VALUES
('cerebro_lesionnel', 'Cérébro-Lésionnel', 1),
('neuro_osteo_musculaire', 'Neuro-ostéo-musculaire', 2),
('psychiatrique', 'Psychiatrique', 3),
('digestif', 'Digestif', 4),
('cardiovasculaire', 'Cardiovasculaire', 5),
('signes_generaux', 'Signes Généraux', 6),
('orl', 'O.R.L.', 7),
('lipodystrophie', 'Lipodystrophie', 8),
('genito_urinaire', 'Génito-Urinaire', 9);

-- ========================================
-- DONNÉES DE RÉFÉRENCE - SIGNES FONCTIONNELS
-- ========================================

-- Cérébro-Lésionnel
INSERT INTO ref_signe_fonctionnel (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'cerebro_lesionnel'), 'anevrisme', 'Anévrisme', 1),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'cerebro_lesionnel'), 'douleurs_mediatrices', 'Douleurs médiatrices', 2),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'cerebro_lesionnel'), 'pyrometriques', 'Pyrométriques', 3),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'cerebro_lesionnel'), 'ecoulement_urethral', 'Écoulement urétral', 4),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'cerebro_lesionnel'), 'depression', 'Dépression', 5),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'cerebro_lesionnel'), 'incontinence_urinaire', 'Incontinence urinaire', 6),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'cerebro_lesionnel'), 'leucorrhee', 'Leucorrhée', 7),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'cerebro_lesionnel'), 'perte_libido', 'Perte libido', 8),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'cerebro_lesionnel'), 'autres_uro_genitaux', 'Autres signes uro-génitaux', 9);

-- Neuro-ostéo-musculaire
INSERT INTO ref_signe_fonctionnel (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'neuro_osteo_musculaire'), 'arthralgie', 'Arthralgie', 1),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'neuro_osteo_musculaire'), 'cephalees', 'Céphalées', 2),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'neuro_osteo_musculaire'), 'crampes', 'Crampes', 3),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'neuro_osteo_musculaire'), 'douleurs_membres', 'Douleurs membres', 4),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'neuro_osteo_musculaire'), 'myalgie', 'Myalgie', 5),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'neuro_osteo_musculaire'), 'paresthesie', 'Paresthésie', 6),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'neuro_osteo_musculaire'), 'tremblement', 'Tremblement', 7),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'neuro_osteo_musculaire'), 'vertiges', 'Vertiges', 8),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'neuro_osteo_musculaire'), 'autres_neuro_osteo', 'Autres signes neuro ostéo-musculaires', 9);

-- Psychiatrique
INSERT INTO ref_signe_fonctionnel (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'psychiatrique'), 'anxiete', 'Anxiété', 1),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'psychiatrique'), 'culpabilite', 'Culpabilité', 2),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'psychiatrique'), 'trouble_humeur', 'Trouble de l''humeur', 3),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'psychiatrique'), 'trouble_memoire', 'Trouble de la mémoire', 4),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'psychiatrique'), 'autres_neuro_psychiatriques', 'Autres signes neuro-psychiatriques', 5);

-- Digestif
INSERT INTO ref_signe_fonctionnel (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'digestif'), 'constipation', 'Constipation', 1),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'digestif'), 'diarrhee', 'Diarrhée', 2),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'digestif'), 'douleurs_abdominales', 'Douleurs abdominales', 3),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'digestif'), 'meteo_abdominale', 'Météo abdominale', 4),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'digestif'), 'nausees_vomissements', 'Nausées et vomissements', 5);

-- Cardiovasculaire
INSERT INTO ref_signe_fonctionnel (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'cardiovasculaire'), 'accident', 'Accident', 1),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'cardiovasculaire'), 'autres_cardiovasculaires', 'Autres signes cardiovasculaires', 2);

-- Signes Généraux
INSERT INTO ref_signe_fonctionnel (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'signes_generaux'), 'amaigrissement', 'Amaigrissement', 1),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'signes_generaux'), 'anorexie', 'Anorexie', 2),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'signes_generaux'), 'asthenie', 'Asthénie', 3),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'signes_generaux'), 'cephalees', 'Céphalées', 4),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'signes_generaux'), 'deshydratation', 'Déshydratation', 5),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'signes_generaux'), 'fievre_persistante', 'Fièvre persistante', 6),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'signes_generaux'), 'insomnie', 'Insomnie', 7),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'signes_generaux'), 'non_observance', 'Non observance', 8),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'signes_generaux'), 'perte_poids', 'Perte de poids', 9),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'signes_generaux'), 'rash_cutaneo_muqueux', 'Rash cutanéo-muqueux général', 10),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'signes_generaux'), 'sueurs_nocturnes', 'Sueurs nocturnes', 11),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'signes_generaux'), 'autres_generaux', 'Autres signes généraux', 12);

-- O.R.L.
INSERT INTO ref_signe_fonctionnel (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'orl'), 'candidose', 'Candidose', 1),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'orl'), 'otalgie', 'Otalgie', 2),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'orl'), 'rhinorrhee', 'Rhinorrhée', 3),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'orl'), 'autres_orl', 'Autres signes ORL', 4);

-- Lipodystrophie
INSERT INTO ref_signe_fonctionnel (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'lipodystrophie'), 'accumulation_graisse', 'Accumulation de graisse', 1),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'lipodystrophie'), 'ballonnement_abdominal', 'Ballonnement abdominal', 2),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'lipodystrophie'), 'bosse_bison', 'Bosse de bison', 3),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'lipodystrophie'), 'perte_graisse', 'Perte de graisse', 4),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'lipodystrophie'), 'autres_lipodystrophie', 'Autres signes lipodystrophie', 5);

-- Génito-Urinaire
INSERT INTO ref_signe_fonctionnel (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'genito_urinaire'), 'amenorrhee', 'Aménorrhée', 1),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'genito_urinaire'), 'douleurs_pelviennes', 'Douleurs pelviennes', 2),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'genito_urinaire'), 'dysmenorrhee', 'Dysménorrhée', 3),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'genito_urinaire'), 'dysurie', 'Dysurie', 4),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'genito_urinaire'), 'ecoulement_urethral', 'Écoulement urétral', 5),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'genito_urinaire'), 'impuissance', 'Impuissance', 6),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'genito_urinaire'), 'incontinence_urinaire', 'Incontinence urinaire', 7),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'genito_urinaire'), 'leucorrhee', 'Leucorrhée', 8),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'genito_urinaire'), 'perte_libido', 'Perte libido', 9),
((SELECT id FROM ref_appareil_fonctionnel WHERE code = 'genito_urinaire'), 'autres_uro_genitaux', 'Autres signes uro-génitaux', 10);

-- ========================================
-- DONNÉES DE RÉFÉRENCE - APPAREILS CLINIQUES
-- ========================================

INSERT INTO ref_appareil_clinique (code, libelle, ordre) VALUES
('orl', 'O.R.L.', 1),
('signes_generaux', 'Signes Généraux', 2),
('neuro_osteo_musculaire', 'Neuro-ostéo-musculaire', 3),
('pleuro_pulmonaire', 'Pleuro-Pulmonaire', 4),
('dermatologique', 'Dermatologique', 5),
('ophtalmologique', 'Ophtalmologique', 6),
('genito_urinaire', 'Génito-Urinaire', 7),
('lipodystrophie', 'Lipodystrophie', 8),
('psychiatrique', 'Psychiatrique', 9),
('digestif', 'Digestif', 10),
('cardiovasculaire', 'Cardiovasculaire', 11),
('puberte', 'Puberté', 12);

-- ========================================
-- DONNÉES DE RÉFÉRENCE - SIGNES CLINIQUES
-- ========================================

-- O.R.L.
INSERT INTO ref_signe_clinique (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_clinique WHERE code = 'orl'), 'aphtose', 'Aphtose', 1),
((SELECT id FROM ref_appareil_clinique WHERE code = 'orl'), 'leucoplasie_chevelue', 'Leucoplasie chevelue', 2),
((SELECT id FROM ref_appareil_clinique WHERE code = 'orl'), 'muguet_buccal', 'Muguet buccal', 3),
((SELECT id FROM ref_appareil_clinique WHERE code = 'orl'), 'odynophagie', 'Odynophagie', 4),
((SELECT id FROM ref_appareil_clinique WHERE code = 'orl'), 'parotide_hypertrophiee', 'Parotide hypertrophiée', 5),
((SELECT id FROM ref_appareil_clinique WHERE code = 'orl'), 'rhinite', 'Rhinite', 6),
((SELECT id FROM ref_appareil_clinique WHERE code = 'orl'), 'sinusite', 'Sinusite', 7),
((SELECT id FROM ref_appareil_clinique WHERE code = 'orl'), 'autres_orl', 'Autres signes ORL', 8);

-- Signes Généraux
INSERT INTO ref_signe_clinique (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_clinique WHERE code = 'signes_generaux'), 'adenopathie_isolee', 'Adénopathie isolée', 1),
((SELECT id FROM ref_appareil_clinique WHERE code = 'signes_generaux'), 'adenopathies_generalisees', 'Adénopathies généralisées', 2),
((SELECT id FROM ref_appareil_clinique WHERE code = 'signes_generaux'), 'anorexie', 'Anorexie', 3),
((SELECT id FROM ref_appareil_clinique WHERE code = 'signes_generaux'), 'cachexie', 'Cachexie', 4),
((SELECT id FROM ref_appareil_clinique WHERE code = 'signes_generaux'), 'fievre_aigue', 'Fièvre aiguë', 5),
((SELECT id FROM ref_appareil_clinique WHERE code = 'signes_generaux'), 'fievre_persistante', 'Fièvre persistante', 6),
((SELECT id FROM ref_appareil_clinique WHERE code = 'signes_generaux'), 'frisson_isole', 'Frisson isolé', 7),
((SELECT id FROM ref_appareil_clinique WHERE code = 'signes_generaux'), 'syndrome_dysthyroidien', 'Syndrome dysthyroïdien', 8),
((SELECT id FROM ref_appareil_clinique WHERE code = 'signes_generaux'), 'syndrome_pseudo_grippal', 'Syndrome pseudo-grippal', 9),
((SELECT id FROM ref_appareil_clinique WHERE code = 'signes_generaux'), 'syndrome_pseudo_paludique', 'Syndrome pseudo-paludique', 10),
((SELECT id FROM ref_appareil_clinique WHERE code = 'signes_generaux'), 'alteration_etat_general', 'Altération de l''état général', 11),
((SELECT id FROM ref_appareil_clinique WHERE code = 'signes_generaux'), 'autres_generaux', 'Autres signes généraux', 12);

-- Neuro-ostéo-musculaire
INSERT INTO ref_signe_clinique (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_clinique WHERE code = 'neuro_osteo_musculaire'), 'ataxie', 'Ataxie', 1),
((SELECT id FROM ref_appareil_clinique WHERE code = 'neuro_osteo_musculaire'), 'atteinte_fonctions_superieures', 'Atteinte des fonctions supérieures', 2),
((SELECT id FROM ref_appareil_clinique WHERE code = 'neuro_osteo_musculaire'), 'deficit_moteur', 'Déficit moteur', 3),
((SELECT id FROM ref_appareil_clinique WHERE code = 'neuro_osteo_musculaire'), 'deficit_sensoriel', 'Déficit sensoriel', 4),
((SELECT id FROM ref_appareil_clinique WHERE code = 'neuro_osteo_musculaire'), 'lumbago', 'Lumbago', 5),
((SELECT id FROM ref_appareil_clinique WHERE code = 'neuro_osteo_musculaire'), 'myalgie', 'Myalgie', 6),
((SELECT id FROM ref_appareil_clinique WHERE code = 'neuro_osteo_musculaire'), 'paralysie_faciale', 'Paralysie faciale', 7),
((SELECT id FROM ref_appareil_clinique WHERE code = 'neuro_osteo_musculaire'), 'polynevrite', 'Polynévrite', 8),
((SELECT id FROM ref_appareil_clinique WHERE code = 'neuro_osteo_musculaire'), 'syndrome_meninge', 'Syndrome méningé', 9),
((SELECT id FROM ref_appareil_clinique WHERE code = 'neuro_osteo_musculaire'), 'tremblement', 'Tremblement', 10),
((SELECT id FROM ref_appareil_clinique WHERE code = 'neuro_osteo_musculaire'), 'vertiges', 'Vertiges', 11),
((SELECT id FROM ref_appareil_clinique WHERE code = 'neuro_osteo_musculaire'), 'autres_neuro_osteo', 'Autres signes neuro ostéo musculaires', 12);

-- Pleuro-Pulmonaire
INSERT INTO ref_signe_clinique (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_clinique WHERE code = 'pleuro_pulmonaire'), 'douleur_thoracique', 'Douleur thoracique', 1),
((SELECT id FROM ref_appareil_clinique WHERE code = 'pleuro_pulmonaire'), 'dyspnee', 'Dyspnée', 2),
((SELECT id FROM ref_appareil_clinique WHERE code = 'pleuro_pulmonaire'), 'toux', 'Toux', 3),
((SELECT id FROM ref_appareil_clinique WHERE code = 'pleuro_pulmonaire'), 'hemoptysie_legere', 'Hémoptysie légère (SIA)', 4),
((SELECT id FROM ref_appareil_clinique WHERE code = 'pleuro_pulmonaire'), 'bronchite_recurrente', 'Bronchite récurrente (SIA)', 5),
((SELECT id FROM ref_appareil_clinique WHERE code = 'pleuro_pulmonaire'), 'cystoses', 'Cystoses', 6),
((SELECT id FROM ref_appareil_clinique WHERE code = 'pleuro_pulmonaire'), 'expectorations', 'Expectorations', 7),
((SELECT id FROM ref_appareil_clinique WHERE code = 'pleuro_pulmonaire'), 'sifflements', 'Sifflements', 8),
((SELECT id FROM ref_appareil_clinique WHERE code = 'pleuro_pulmonaire'), 'autres_pleuro_pulmonaires', 'Autres signes pleuro-pulmonaires', 9);

-- Dermatologique
INSERT INTO ref_signe_clinique (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'eczema', 'Eczéma', 1),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'erysipele', 'Érysipèle', 2),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'melanodermie', 'Mélanodermie (présenter le type)', 3),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'prurits', 'Prurits', 4),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'eruption_cutanee', 'Éruption cutanée généralisée (+ typer)', 5),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'erytheme', 'Érythème', 6),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'folliculite_generalisee', 'Folliculite généralisée', 7),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'folliculite', 'Folliculite', 8),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'ictere', 'Ictère', 9),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'kerposis', 'Kerposis', 10),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'kaposis_cutane', 'Kaposis cutané', 11),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'leucoplasie_chevelue', 'Leucoplasie chevelue', 12),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'lipodystrophie', 'Lipodystrophie', 13),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'melanodermie_2', 'Mélanodermie', 14),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'muguet_buccal', 'Muguet buccal', 15),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'odynophagie_faciale', 'Odynophagie faciale à préciser', 16),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'onychomycoses', 'Onychomycoses', 17),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'pustulose_cutanee', 'Pustulose cutanée', 18),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'prurit', 'Prurit', 19),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'purpura', 'Purpura', 20),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'rash', 'Rash', 21),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'ulceres_buccobois', 'Ulcères buccobois', 22),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'ulceration', 'Ulcération', 23),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'verrues_virales', 'Verrues d''origine virale', 24),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'zona', 'Zona (SIA)', 25),
((SELECT id FROM ref_appareil_clinique WHERE code = 'dermatologique'), 'autres_dermatologiques', 'Autres signes dermatologiques', 26);

-- Ophtalmologique
INSERT INTO ref_signe_clinique (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_clinique WHERE code = 'ophtalmologique'), 'douleurs_champ_visuel', 'Douleurs Champ Visuel', 1),
((SELECT id FROM ref_appareil_clinique WHERE code = 'ophtalmologique'), 'glaucome', 'Glaucome', 2),
((SELECT id FROM ref_appareil_clinique WHERE code = 'ophtalmologique'), 'keratite', 'Kératite', 3),
((SELECT id FROM ref_appareil_clinique WHERE code = 'ophtalmologique'), 'trouble_visuel', 'Trouble visuel (SA)', 4),
((SELECT id FROM ref_appareil_clinique WHERE code = 'ophtalmologique'), 'anomalie_champ_visuel', 'Anomalie du champ visuel', 5),
((SELECT id FROM ref_appareil_clinique WHERE code = 'ophtalmologique'), 'baisse_acuite_visuelle', 'Baisse acuité visuelle', 6),
((SELECT id FROM ref_appareil_clinique WHERE code = 'ophtalmologique'), 'cecite', 'Cécité', 7),
((SELECT id FROM ref_appareil_clinique WHERE code = 'ophtalmologique'), 'douleur_oculaire', 'Douleur oculaire', 8),
((SELECT id FROM ref_appareil_clinique WHERE code = 'ophtalmologique'), 'oeil_rouge', 'Œil rouge', 9),
((SELECT id FROM ref_appareil_clinique WHERE code = 'ophtalmologique'), 'ptose', 'Ptose', 10),
((SELECT id FROM ref_appareil_clinique WHERE code = 'ophtalmologique'), 'autres_ophtalmologiques', 'Autres signes ophtalmologiques', 11);

-- Génito-Urinaire
INSERT INTO ref_signe_clinique (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_clinique WHERE code = 'genito_urinaire'), 'coliques_nephretiques', 'Coliques néphrétiques (SIA)', 1),
((SELECT id FROM ref_appareil_clinique WHERE code = 'genito_urinaire'), 'polyurie', 'Polyurie', 2),
((SELECT id FROM ref_appareil_clinique WHERE code = 'genito_urinaire'), 'prurit_vulvaire', 'Prurit vulvaire du col', 3),
((SELECT id FROM ref_appareil_clinique WHERE code = 'genito_urinaire'), 'pygemie_interne', 'Pygémie interne du col', 4),
((SELECT id FROM ref_appareil_clinique WHERE code = 'genito_urinaire'), 'syndrome_urethral', 'Syndrome urétéral', 5),
((SELECT id FROM ref_appareil_clinique WHERE code = 'genito_urinaire'), 'fissure_anale', 'Fissure anale', 6),
((SELECT id FROM ref_appareil_clinique WHERE code = 'genito_urinaire'), 'fistule_anale', 'Fistule anale', 7),
((SELECT id FROM ref_appareil_clinique WHERE code = 'genito_urinaire'), 'hemorroides', 'Hémorroïdes', 8),
((SELECT id FROM ref_appareil_clinique WHERE code = 'genito_urinaire'), 'hypertrophie_mammaire', 'Hypertrophie mammaire', 9),
((SELECT id FROM ref_appareil_clinique WHERE code = 'genito_urinaire'), 'leucorrhee', 'Leucorrhée', 10),
((SELECT id FROM ref_appareil_clinique WHERE code = 'genito_urinaire'), 'metrorragie', 'Métrorragie', 11),
((SELECT id FROM ref_appareil_clinique WHERE code = 'genito_urinaire'), 'ulcerations_genitales', 'Ulcérations génitales', 12),
((SELECT id FROM ref_appareil_clinique WHERE code = 'genito_urinaire'), 'autres_uro_genitaux', 'Autres signes uro-génitaux', 13);

-- Lipodystrophie
INSERT INTO ref_signe_clinique (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_clinique WHERE code = 'lipodystrophie'), 'accumulation_graisse', 'Accumulation de graisse', 1),
((SELECT id FROM ref_appareil_clinique WHERE code = 'lipodystrophie'), 'ballonnement_abdominal', 'Ballonnement abdominal', 2),
((SELECT id FROM ref_appareil_clinique WHERE code = 'lipodystrophie'), 'bosse_bison', 'Bosse de bison', 3),
((SELECT id FROM ref_appareil_clinique WHERE code = 'lipodystrophie'), 'gynecomastie', 'Gynécomastie', 4),
((SELECT id FROM ref_appareil_clinique WHERE code = 'lipodystrophie'), 'perte_graisse', 'Perte de graisse', 5),
((SELECT id FROM ref_appareil_clinique WHERE code = 'lipodystrophie'), 'autres_lipodystrophie', 'Autres signes lipodystrophie', 6);

-- Psychiatrique
INSERT INTO ref_signe_clinique (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_clinique WHERE code = 'psychiatrique'), 'demence_vih', 'Démence liée au VIH', 1),
((SELECT id FROM ref_appareil_clinique WHERE code = 'psychiatrique'), 'depression_majeure', 'Dépression majeure', 2),
((SELECT id FROM ref_appareil_clinique WHERE code = 'psychiatrique'), 'insomnie', 'Insomnie', 3),
((SELECT id FROM ref_appareil_clinique WHERE code = 'psychiatrique'), 'irritabilite', 'Irritabilité', 4),
((SELECT id FROM ref_appareil_clinique WHERE code = 'psychiatrique'), 'syndrome_depressif', 'Syndrome dépressif', 5),
((SELECT id FROM ref_appareil_clinique WHERE code = 'psychiatrique'), 'tentative_suicide', 'Tentative de suicide', 6),
((SELECT id FROM ref_appareil_clinique WHERE code = 'psychiatrique'), 'trouble_memoire', 'Trouble de la mémoire', 7),
((SELECT id FROM ref_appareil_clinique WHERE code = 'psychiatrique'), 'trouble_comportement', 'Trouble du comportement', 8),
((SELECT id FROM ref_appareil_clinique WHERE code = 'psychiatrique'), 'autres_neuro_psychiatriques', 'Autres signes neuro-psychiatriques', 9);

-- Digestif
INSERT INTO ref_signe_clinique (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_clinique WHERE code = 'digestif'), 'angoisse_etiolaire', 'Angoisse étiolaire', 1),
((SELECT id FROM ref_appareil_clinique WHERE code = 'digestif'), 'ascite', 'Ascite', 2),
((SELECT id FROM ref_appareil_clinique WHERE code = 'digestif'), 'circulation_veineuse', 'Circulation veineuse collatérale', 3),
((SELECT id FROM ref_appareil_clinique WHERE code = 'digestif'), 'diarrhee', 'Diarrhée', 4),
((SELECT id FROM ref_appareil_clinique WHERE code = 'digestif'), 'douleurs_abdominales', 'Douleurs abdominales', 5),
((SELECT id FROM ref_appareil_clinique WHERE code = 'digestif'), 'dysphagie', 'Dysphagie', 6),
((SELECT id FROM ref_appareil_clinique WHERE code = 'digestif'), 'encephalopathie_hepatique', 'Encéphalopathie hépatique', 7),
((SELECT id FROM ref_appareil_clinique WHERE code = 'digestif'), 'erosions_gastriques', 'Érosions gastriques', 8),
((SELECT id FROM ref_appareil_clinique WHERE code = 'digestif'), 'gastroenterite', 'Gastroentérite', 9),
((SELECT id FROM ref_appareil_clinique WHERE code = 'digestif'), 'hemorragie_digestive', 'Hémorragie digestive', 10),
((SELECT id FROM ref_appareil_clinique WHERE code = 'digestif'), 'hepatomegalie', 'Hépatomégalie', 11),
((SELECT id FROM ref_appareil_clinique WHERE code = 'digestif'), 'ictere', 'Ictère', 12),
((SELECT id FROM ref_appareil_clinique WHERE code = 'digestif'), 'masse_abdominale', 'Masse abdominale', 13),
((SELECT id FROM ref_appareil_clinique WHERE code = 'digestif'), 'nausees_vomissements', 'Nausées et vomissements', 14),
((SELECT id FROM ref_appareil_clinique WHERE code = 'digestif'), 'splenomegalie', 'Splénomégalie', 15),
((SELECT id FROM ref_appareil_clinique WHERE code = 'digestif'), 'varices_oesophagiennes', 'Varices œsophagiennes', 16),
((SELECT id FROM ref_appareil_clinique WHERE code = 'digestif'), 'autres_digestifs', 'Autres signes digestifs', 17);

-- Cardiovasculaire
INSERT INTO ref_signe_clinique (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_clinique WHERE code = 'cardiovasculaire'), 'circulation_alternee', 'Circulation alternée (SIA)', 1),
((SELECT id FROM ref_appareil_clinique WHERE code = 'cardiovasculaire'), 'hypertension_arterielle', 'Hypertension artérielle', 2),
((SELECT id FROM ref_appareil_clinique WHERE code = 'cardiovasculaire'), 'lipothymie', 'Lipothymie', 3),
((SELECT id FROM ref_appareil_clinique WHERE code = 'cardiovasculaire'), 'souffle_cardiaque', 'Souffle cardiaque', 4),
((SELECT id FROM ref_appareil_clinique WHERE code = 'cardiovasculaire'), 'trouble_rythme', 'Trouble du rythme', 5),
((SELECT id FROM ref_appareil_clinique WHERE code = 'cardiovasculaire'), 'autres_cardiovasculaires', 'Autres signes cardiovasculaires', 6);

-- Puberté
INSERT INTO ref_signe_clinique (appareil_id, code, libelle, ordre) VALUES
((SELECT id FROM ref_appareil_clinique WHERE code = 'puberte'), 'tanner_filles_s2', 'Classi Tanner - Filles : S2', 1),
((SELECT id FROM ref_appareil_clinique WHERE code = 'puberte'), 'tanner_filles_s3', 'Classi Tanner - Filles : S3', 2),
((SELECT id FROM ref_appareil_clinique WHERE code = 'puberte'), 'tanner_filles_s4', 'Classi Tanner - Filles : S4', 3),
((SELECT id FROM ref_appareil_clinique WHERE code = 'puberte'), 'tanner_filles_s5', 'Classi Tanner - Filles : S5', 4),
((SELECT id FROM ref_appareil_clinique WHERE code = 'puberte'), 'tanner_filles_p1', 'Classi Tanner - Filles : P1', 5),
((SELECT id FROM ref_appareil_clinique WHERE code = 'puberte'), 'tanner_filles_p2', 'Classi Tanner - Filles : P2', 6),
((SELECT id FROM ref_appareil_clinique WHERE code = 'puberte'), 'tanner_filles_p3', 'Classi Tanner - Filles : P3', 7),
((SELECT id FROM ref_appareil_clinique WHERE code = 'puberte'), 'tanner_filles_p4', 'Classi Tanner - Filles : P4', 8),
((SELECT id FROM ref_appareil_clinique WHERE code = 'puberte'), 'tanner_filles_p5', 'Classi Tanner - Filles : P5', 9),
((SELECT id FROM ref_appareil_clinique WHERE code = 'puberte'), 'tanner_garcons_t1', 'Classi Tanner - Garçons : T1', 10),
((SELECT id FROM ref_appareil_clinique WHERE code = 'puberte'), 'tanner_garcons_t2', 'Classi Tanner - Garçons : T2', 11),
((SELECT id FROM ref_appareil_clinique WHERE code = 'puberte'), 'tanner_garcons_t3', 'Classi Tanner - Garçons : T3', 12),
((SELECT id FROM ref_appareil_clinique WHERE code = 'puberte'), 'tanner_garcons_t4', 'Classi Tanner - Garçons : T4', 13),
((SELECT id FROM ref_appareil_clinique WHERE code = 'puberte'), 'tanner_garcons_t5', 'Classi Tanner - Garçons : T5', 14),
((SELECT id FROM ref_appareil_clinique WHERE code = 'puberte'), 'tanner_garcons_g1', 'Classi Tanner - Garçons : G1', 15),
((SELECT id FROM ref_appareil_clinique WHERE code = 'puberte'), 'tanner_garcons_g2', 'Classi Tanner - Garçons : G2', 16),
((SELECT id FROM ref_appareil_clinique WHERE code = 'puberte'), 'tanner_garcons_g3', 'Classi Tanner - Garçons : G3', 17),
((SELECT id FROM ref_appareil_clinique WHERE code = 'puberte'), 'tanner_garcons_g4', 'Classi Tanner - Garçons : G4', 18),
((SELECT id FROM ref_appareil_clinique WHERE code = 'puberte'), 'tanner_garcons_g5', 'Classi Tanner - Garçons : G5', 19);
