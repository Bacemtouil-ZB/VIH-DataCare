CREATE TABLE Laboratory (
    laboratoryId SERIAL PRIMARY KEY,
    laboratory_date DATE,
    viralLoad NUMERIC,
    CDCstage VARCHAR(50),
    calcium NUMERIC,
    potassium NUMERIC,
    lympho NUMERIC,
    PNN NUMERIC,
    CD4 NUMERIC,
    lineage NUMERIC,
);
