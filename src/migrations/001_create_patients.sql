CREATE TABLE Patient (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    surname VARCHAR(100),
    birthDate DATE,
    gender VARCHAR(10),
    city VARCHAR(100),
    state VARCHAR(100),
    postalCode INTEGER,
    nationality VARCHAR(50),
    height NUMERIC,
    modeOfTransmission VARCHAR(50),
    maritalStatus VARCHAR(50),
    numberChildren INTEGER,
    educationLevel VARCHAR(50),
    housing VARCHAR(100)
);
