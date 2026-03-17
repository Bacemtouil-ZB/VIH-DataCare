
CREATE TABLE IF NOT EXISTS governorates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE  IF NOT EXISTS postal_codes (
    id SERIAL PRIMARY KEY,
    governorate_id INTEGER NOT NULL 
        REFERENCES governorates(id)
        ON DELETE CASCADE,
    code CHAR(4) NOT NULL UNIQUE
        CHECK (code ~ '^[0-9]{4}$')
);

CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    postal_code_id INTEGER NOT NULL 
        REFERENCES postal_codes(id),
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE postal_codes
ADD COLUMN IF NOT EXISTS place_name VARCHAR(120) NOT NULL DEFAULT '';

ALTER TABLE postal_codes
ALTER COLUMN place_name DROP DEFAULT;

ALTER TABLE postal_codes
ADD CONSTRAINT postal_codes_code_unique UNIQUE (code);

ALTER TABLE postal_codes
ADD CONSTRAINT postal_codes_governorate_place_unique UNIQUE (governorate_id, place_name);


ALTER TABLE addresses
ADD COLUMN IF NOT EXISTS exact_address TEXT;

-- Seed idempotent des gouvernorats (necessaire avant l'import des codes postaux)
INSERT INTO governorates (name) VALUES
('ARIANA'),
('BEJA'),
('BEN AROUS'),
('BIZERTE'),
('GABES'),
('GAFSA'),
('JENDOUBA'),
('KAIROUAN'),
('KASSERINE'),
('KEBILI'),
('KEF'),
('MAHDIA'),
('MANOUBA'),
('MEDENINE'),
('MONASTIR'),
('NABEUL'),
('SFAX'),
('SIDI BOUZID'),
('SILIANA'),
('SOUSSE'),
('TATAOUINE'),
('TOZEUR'),
('TUNIS'),
('ZAGHOUAN')
ON CONFLICT (name) DO NOTHING;

-- Source: https://github.com/Mehdi1chouk/Tunisia_Governorates/blob/master/state-municipality.json
-- Insertion de donnees a partir du JSON des codes postaux de la Tunisie
WITH raw AS (
  SELECT $$[
  {
    "Name": "ARIANA",
    "NameAr": "Ø£Ø±ÙŠØ§Ù†Ø©",
    "Value": "ARIANA",
    "Delegations": [
      {
        "Name": "ARIANA VILLE",
        "NameAr": "Ø£Ø±ÙŠØ§Ù†Ø© Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©",
        "Value": "ARIANA VILLE",
        "PostalCode": "2058",
        "Latitude": 36.866474,
        "Longitude": 10.164726
      },
      {
        "Name": "SIDI THABET",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ø«Ø§Ø¨Øª",
        "Value": "SIDI THABET",
        "PostalCode": "2020",
        "Latitude": 36.898614,
        "Longitude": 10.030632
      },
      {
        "Name": "LA SOUKRA",
        "NameAr": "Ø³ÙƒØ±Ø©",
        "Value": "LA SOUKRA",
        "PostalCode": "2036",
        "Latitude": 36.883618,
        "Longitude": 10.240874
      },
      {
        "Name": "KALAAT LANDLOUS",
        "NameAr": "Ù‚Ù„Ø¹Ø© Ø§Ù„Ø£Ù†Ø¯Ù„Ø³",
        "Value": "KALAAT LANDLOUS",
        "PostalCode": "2061",
        "Latitude": 37.066667,
        "Longitude": 10.183333
      },
      {
        "Name": "RAOUED",
        "NameAr": "Ø±ÙˆØ§Ø¯",
        "Value": "RAOUED",
        "PostalCode": "2083",
        "Latitude": 36.931944,
        "Longitude": 10.160278
      },
      {
        "Name": "MNIHLA",
        "NameAr": "Ø§Ù„Ù…Ù†ÙŠÙ‡Ù„Ø©",
        "Value": "MNIHLA",
        "PostalCode": "2094",
        "Latitude": 36.866331,
        "Longitude": 10.089634
      },
      {
        "Name": "ETTADHAMEN",
        "NameAr": "Ø§Ù„ØªØ¶Ø§Ù…Ù†",
        "Value": "ETTADHAMEN",
        "PostalCode": "2041",
        "Latitude": 36.839821,
        "Longitude": 10.099205
      }
    ]
  },
  {
    "Name": "BEJA",
    "NameAr": "Ø¨Ø§Ø¬Ø©",
    "Value": "BEJA",
    "Delegations": [
      {
        "Name": "TESTOUR",
        "NameAr": "ØªØ³ØªÙˆØ±",
        "Value": "TESTOUR",
        "PostalCode": "9014",
        "Latitude": 36.552305,
        "Longitude": 9.444303
      },
      {
        "Name": "TEBOURSOUK",
        "NameAr": "ØªØ¨Ø±Ø³Ù‚",
        "Value": "TEBOURSOUK",
        "PostalCode": "9032",
        "Latitude": 36.458038,
        "Longitude": 9.249001
      },
      {
        "Name": "BEJA NORD",
        "NameAr": "Ø¨Ø§Ø¬Ø© Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        "Value": "BEJA NORD",
        "PostalCode": "9000",
        "Latitude": 36.728826,
        "Longitude": 9.183218
      },
      {
        "Name": "MEJEZ EL BAB",
        "NameAr": "Ù…Ø¬Ø§Ø² Ø§Ù„Ø¨Ø§Ø¨",
        "Value": "MEJEZ EL BAB",
        "PostalCode": "9034",
        "Latitude": 36.649444,
        "Longitude": 9.609167
      },
      {
        "Name": "NEFZA",
        "NameAr": "Ù†ÙØ²Ø©",
        "Value": "NEFZA",
        "PostalCode": "9010",
        "Latitude": 37.074444,
        "Longitude": 9.085833
      },
      {
        "Name": "BEJA SUD",
        "NameAr": "Ø¨Ø§Ø¬Ø© Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "BEJA SUD",
        "PostalCode": "9021",
        "Latitude": 36.728826,
        "Longitude": 9.183218
      },
      {
        "Name": "THIBAR",
        "NameAr": "ØªÙŠØ¨Ø§Ø±",
        "Value": "THIBAR",
        "PostalCode": "9022",
        "Latitude": 36.611944,
        "Longitude": 9.059722
      },
      {
        "Name": "AMDOUN",
        "NameAr": "Ø¹Ù…Ø¯ÙˆÙ†",
        "Value": "AMDOUN",
        "PostalCode": "9030",
        "Latitude": 36.839167,
        "Longitude": 9.081111
      },
      {
        "Name": "GOUBELLAT",
        "NameAr": "Ù‚Ø¨Ù„Ø§Ø·",
        "Value": "GOUBELLAT",
        "PostalCode": "9080",
        "Latitude": 36.534167,
        "Longitude": 9.600000
      }
    ]
  },
  {
    "Name": "BEN AROUS",
    "NameAr": "Ø¨Ù† Ø¹Ø±ÙˆØ³",
    "Value": "BEN_AROUS",
    "Delegations": [
      {
        "Name": "FOUCHANA",
        "NameAr": "ÙÙˆØ´Ø§Ù†Ø©",
        "Value": "FOUCHANA",
        "PostalCode": "2082",
        "Latitude": 36.703889,
        "Longitude": 10.155000
      },
      {
        "Name": "HAMMAM LIF",
        "NameAr": "Ø­Ù…Ø§Ù… Ø§Ù„Ø£Ù†Ù",
        "Value": "HAMMAM LIF",
        "PostalCode": "2050",
        "Latitude": 36.727778,
        "Longitude": 10.336111
      },
      {
        "Name": "EL MOUROUJ",
        "NameAr": "Ø§Ù„Ù…Ø±ÙˆØ¬",
        "Value": "EL MOUROUJ",
        "PostalCode": "2074",
        "Latitude": 36.739889,
        "Longitude": 10.205000
      },
      {
        "Name": "BOU MHEL EL BASSATINE",
        "NameAr": "Ø¨ÙˆÙ…Ù‡Ù„ Ø§Ù„Ø¨Ø³Ø§ØªÙŠÙ†",
        "Value": "BOU MHEL EL BASSATINE",
        "PostalCode": "2097",
        "Latitude": 36.729444,
        "Longitude": 10.280000
      },
      {
        "Name": "RADES",
        "NameAr": "Ø±Ø§Ø¯Ø³",
        "Value": "RADES",
        "PostalCode": "2098",
        "Latitude": 36.766667,
        "Longitude": 10.283333
      },
      {
        "Name": "MOHAMADIA",
        "NameAr": "Ø§Ù„Ù…Ø­Ù…Ø¯ÙŠØ©",
        "Value": "MOHAMADIA",
        "PostalCode": "1145",
        "Latitude": 36.689444,
        "Longitude": 10.131389
      },
      {
        "Name": "MEGRINE",
        "NameAr": "Ù…Ù‚Ø±ÙŠÙ†",
        "Value": "MEGRINE",
        "PostalCode": "2033",
        "Latitude": 36.781111,
        "Longitude": 10.238333
      },
      {
        "Name": "NOUVELLE MEDINA",
        "NameAr": "Ø§Ù„Ù…Ø¯ÙŠÙ†Ø© Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©",
        "Value": "NOUVELLE MEDINA",
        "PostalCode": "2063",
        "Latitude": 36.753889,
        "Longitude": 10.232222
      },
      {
        "Name": "HAMMAM CHATT",
        "NameAr": "Ø­Ù…Ø§Ù… Ø§Ù„Ø´Ø·",
        "Value": "HAMMAM CHATT",
        "PostalCode": "1164",
        "Latitude": 36.700000,
        "Longitude": 10.366667
      },
      {
        "Name": "MORNAG",
        "NameAr": "Ù…Ø±Ù†Ø§Ù‚",
        "Value": "MORNAG",
        "PostalCode": "2064",
        "Latitude": 36.633333,
        "Longitude": 10.250000
      },
      {
        "Name": "EZZAHRA",
        "NameAr": "Ø§Ù„Ø²Ù‡Ø±Ø§Ø¡",
        "Value": "EZZAHRA",
        "PostalCode": "2034",
        "Latitude": 36.743333,
        "Longitude": 10.308333
      },
      {
        "Name": "BEN AROUS",
        "NameAr": "Ø¨Ù† Ø¹Ø±ÙˆØ³",
        "Value": "BEN AROUS",
        "PostalCode": "2043",
        "Latitude": 36.748333,
        "Longitude": 10.222500
      }
    ]
  },
  {
    "Name": "BIZERTE",
    "NameAr": "Ø¨Ù†Ø²Ø±Øª",
    "Value": "BIZERTE",
    "Delegations": [
      {
        "Name": "MENZEL JEMIL",
        "NameAr": "Ù…Ù†Ø²Ù„ Ø¬Ù…ÙŠÙ„",
        "Value": "MENZEL JEMIL",
        "PostalCode": "7035",
        "Latitude": 37.233333,
        "Longitude": 9.916667
      },
      {
        "Name": "BIZERTE SUD",
        "NameAr": "Ø¨Ù†Ø²Ø±Øª Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "BIZERTE SUD",
        "PostalCode": "7071",
        "Latitude": 37.274444,
        "Longitude": 9.873889
      },
      {
        "Name": "SEJNANE",
        "NameAr": "Ø³Ø¬Ù†Ø§Ù†",
        "Value": "SEJNANE",
        "PostalCode": "7010",
        "Latitude": 37.153889,
        "Longitude": 9.238889
      },
      {
        "Name": "GHAR EL MELH",
        "NameAr": "ØºØ§Ø± Ø§Ù„Ù…Ù„Ø­",
        "Value": "GHAR EL MELH",
        "PostalCode": "7024",
        "Latitude": 37.166667,
        "Longitude": 10.193056
      },
      {
        "Name": "MENZEL BOURGUIBA",
        "NameAr": "Ù…Ù†Ø²Ù„ Ø¨ÙˆØ±Ù‚ÙŠØ¨Ø©",
        "Value": "MENZEL BOURGUIBA",
        "PostalCode": "7072",
        "Latitude": 37.150000,
        "Longitude": 9.783333
      },
      {
        "Name": "RAS JEBEL",
        "NameAr": "Ø±Ø£Ø³ Ø§Ù„Ø¬Ø¨Ù„",
        "Value": "RAS JEBEL",
        "PostalCode": "7025",
        "Latitude": 37.214722,
        "Longitude": 10.121389
      },
      {
        "Name": "GHEZALA",
        "NameAr": "ØºØ²Ø§Ù„Ø©",
        "Value": "GHEZALA",
        "PostalCode": "7040",
        "Latitude": 37.116667,
        "Longitude": 9.533333
      },
      {
        "Name": "JOUMINE",
        "NameAr": "Ø¬ÙˆÙ…ÙŠÙ†",
        "Value": "JOUMINE",
        "PostalCode": "7012",
        "Latitude": 36.950000,
        "Longitude": 9.400000
      },
      {
        "Name": "UTIQUE",
        "NameAr": "Ø£ÙˆØªÙŠÙƒ",
        "Value": "UTIQUE",
        "PostalCode": "7013",
        "Latitude": 37.052500,
        "Longitude": 10.058889
      },
      {
        "Name": "BIZERTE NORD",
        "NameAr": "Ø¨Ù†Ø²Ø±Øª Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        "Value": "BIZERTE NORD",
        "PostalCode": "7029",
        "Latitude": 37.274444,
        "Longitude": 9.873889
      },
      {
        "Name": "EL ALIA",
        "NameAr": "Ø§Ù„Ø¹Ø§Ù„ÙŠØ©",
        "Value": "EL ALIA",
        "PostalCode": "7081",
        "Latitude": 37.169167,
        "Longitude": 10.045000
      },
      {
        "Name": "MATEUR",
        "NameAr": "Ù…Ø§Ø·Ø±",
        "Value": "MATEUR",
        "PostalCode": "7030",
        "Latitude": 37.040278,
        "Longitude": 9.665556
      },
      {
        "Name": "JARZOUNA",
        "NameAr": "Ø¬Ø±Ø²ÙˆÙ†Ø©",
        "Value": "JARZOUNA",
        "PostalCode": "7021",
        "Latitude": 37.258889,
        "Longitude": 9.882222
      },
      {
        "Name": "TINJA",
        "NameAr": "ØªÙŠÙ†Ø¬Ø©",
        "Value": "TINJA",
        "PostalCode": "7032",
        "Latitude": 37.161667,
        "Longitude": 9.759444
      }
    ]
  },
  {
    "Name": "GABES",
    "NameAr": "Ù‚Ø§Ø¨Ø³",
    "Value": "GABES",
    "Delegations": [
      {
        "Name": "GABES SUD",
        "NameAr": "Ù‚Ø§Ø¨Ø³ Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "GABES SUD",
        "PostalCode": "6012",
        "Latitude": 33.881453,
        "Longitude": 10.098195
      },
      {
        "Name": "MATMATA",
        "NameAr": "Ù…Ø·Ù…Ø§Ø·Ø©",
        "Value": "MATMATA",
        "PostalCode": "6034",
        "Latitude": 33.542778,
        "Longitude": 9.974722
      },
      {
        "Name": "MARETH",
        "NameAr": "Ù…Ø§Ø±Ø«",
        "Value": "MARETH",
        "PostalCode": "6080",
        "Latitude": 33.627778,
        "Longitude": 10.295833
      },
      {
        "Name": "EL HAMMA",
        "NameAr": "Ø§Ù„Ø­Ø§Ù…Ø©",
        "Value": "EL HAMMA",
        "PostalCode": "6013",
        "Latitude": 33.888889,
        "Longitude": 9.794444
      },
      {
        "Name": "NOUVELLE MATMATA",
        "NameAr": "Ù…Ø·Ù…Ø§Ø·Ø© Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©",
        "Value": "NOUVELLE MATMATA",
        "PostalCode": "6044",
        "Latitude": 33.702222,
        "Longitude": 10.025278
      },
      {
        "Name": "GABES MEDINA",
        "NameAr": "Ù‚Ø§Ø¨Ø³ Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©",
        "Value": "GABES MEDINA",
        "PostalCode": "6040",
        "Latitude": 33.886300,
        "Longitude": 10.112800
      },
      {
        "Name": "GABES OUEST",
        "NameAr": "Ù‚Ø§Ø¨Ø³ Ø§Ù„ØºØ±Ø¨ÙŠØ©",
        "Value": "GABES OUEST",
        "PostalCode": "6041",
        "Latitude": 33.881453,
        "Longitude": 10.098195
      },
      {
        "Name": "EL METOUIA",
        "NameAr": "Ø§Ù„Ù…Ø·ÙˆÙŠØ©",
        "Value": "EL METOUIA",
        "PostalCode": "6052",
        "Latitude": 33.961111,
        "Longitude": 10.005556
      },
      {
        "Name": "GHANNOUCHE",
        "NameAr": "ØºÙ†ÙˆØ´",
        "Value": "GHANNOUCHE",
        "PostalCode": "6021",
        "Latitude": 33.933333,
        "Longitude": 10.066667
      },
      {
        "Name": "MENZEL HABIB",
        "NameAr": "Ù…Ù†Ø²Ù„ Ø§Ù„Ø­Ø¨ÙŠØ¨",
        "Value": "MENZEL HABIB",
        "PostalCode": "6030",
        "Latitude": 34.125833,
        "Longitude": 9.703333
      }
    ]
  },
  {
    "Name": "GAFSA",
    "NameAr": "Ù‚ÙØµØ©",
    "Value": "GAFSA",
    "Delegations": [
      {
        "Name": "BELKHIR",
        "NameAr": "Ø¨Ù„Ø®ÙŠØ±",
        "Value": "BELKHIR",
        "PostalCode": "2135",
        "Latitude": 34.466667,
        "Longitude": 9.066667
      },
      {
        "Name": "GAFSA NORD",
        "NameAr": "Ù‚ÙØµØ© Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        "Value": "GAFSA NORD",
        "PostalCode": "2196",
        "Latitude": 34.425000,
        "Longitude": 8.784167
      },
      {
        "Name": "SNED",
        "NameAr": "Ø§Ù„Ø³Ù†Ø¯",
        "Value": "SNED",
        "PostalCode": "2116",
        "Latitude": 34.472222,
        "Longitude": 9.211111
      },
      {
        "Name": "REDEYEF",
        "NameAr": "Ø§Ù„Ø±Ø¯ÙŠÙ",
        "Value": "REDEYEF",
        "PostalCode": "2140",
        "Latitude": 34.383333,
        "Longitude": 8.150000
      },
      {
        "Name": "GAFSA SUD",
        "NameAr": "Ù‚ÙØµØ© Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "GAFSA SUD",
        "PostalCode": "2100",
        "Latitude": 34.425000,
        "Longitude": 8.784167
      },
      {
        "Name": "EL GUETTAR",
        "NameAr": "Ø§Ù„Ù‚Ø·Ø§Ø±",
        "Value": "EL GUETTAR",
        "PostalCode": "2145",
        "Latitude": 34.328333,
        "Longitude": 8.951944
      },
      {
        "Name": "EL KSAR",
        "NameAr": "Ø§Ù„Ù‚ØµØ±",
        "Value": "EL KSAR",
        "PostalCode": "2151",
        "Latitude": 34.400000,
        "Longitude": 8.816667
      },
      {
        "Name": "MOULARES",
        "NameAr": "Ø£Ù… Ø§Ù„Ø¹Ø±Ø§Ø¦Ø³",
        "Value": "MOULARES",
        "PostalCode": "2161",
        "Latitude": 34.494444,
        "Longitude": 8.251944
      },
      {
        "Name": "EL MDHILLA",
        "NameAr": "Ø§Ù„Ù…Ø¸ÙŠÙ„Ø©",
        "Value": "EL MDHILLA",
        "PostalCode": "2170",
        "Latitude": 34.323333,
        "Longitude": 8.602500
      },
      {
        "Name": "METLAOUI",
        "NameAr": "Ø§Ù„Ù…ØªÙ„ÙˆÙŠ",
        "Value": "METLAOUI",
        "PostalCode": "2130",
        "Latitude": 34.325833,
        "Longitude": 8.401389
      },
      {
        "Name": "SIDI AICH",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ø¹ÙŠØ´",
        "Value": "SIDI AICH",
        "PostalCode": "2131",
        "Latitude": 34.600000,
        "Longitude": 8.883333
      }
    ]
  },
  {
    "Name": "JENDOUBA",
    "NameAr": "Ø¬Ù†Ø¯ÙˆØ¨Ø©",
    "Value": "JENDOUBA",
    "Delegations": [
      {
        "Name": "BALTA BOU AOUENE",
        "NameAr": "Ø¨Ù„Ø·Ø© Ø¨ÙˆØ¹ÙˆØ§Ù†",
        "Value": "BALTA BOU AOUENE",
        "PostalCode": "8116",
        "Latitude": 36.450000,
        "Longitude": 8.966667
      },
      {
        "Name": "FERNANA",
        "NameAr": "ÙØ±Ù†Ø§Ù†Ø©",
        "Value": "FERNANA",
        "PostalCode": "8142",
        "Latitude": 36.652500,
        "Longitude": 8.693056
      },
      {
        "Name": "JENDOUBA NORD",
        "NameAr": "Ø¬Ù†Ø¯ÙˆØ¨Ø© Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        "Value": "JENDOUBA NORD",
        "PostalCode": "8189",
        "Latitude": 36.501000,
        "Longitude": 8.780000
      },
      {
        "Name": "AIN DRAHAM",
        "NameAr": "Ø¹ÙŠÙ† Ø¯Ø±Ø§Ù‡Ù…",
        "Value": "AIN DRAHAM",
        "PostalCode": "8121",
        "Latitude": 36.777500,
        "Longitude": 8.691944
      },
      {
        "Name": "TABARKA",
        "NameAr": "Ø·Ø¨Ø±Ù‚Ø©",
        "Value": "TABARKA",
        "PostalCode": "8192",
        "Latitude": 36.954444,
        "Longitude": 8.758056
      },
      {
        "Name": "JENDOUBA",
        "NameAr": "Ø¬Ù†Ø¯ÙˆØ¨Ø©",
        "Value": "JENDOUBA",
        "PostalCode": "8122",
        "Latitude": 36.501000,
        "Longitude": 8.780000
      },
      {
        "Name": "BOU SALEM",
        "NameAr": "Ø¨ÙˆØ³Ø§Ù„Ù…",
        "Value": "BOU SALEM",
        "PostalCode": "8143",
        "Latitude": 36.611667,
        "Longitude": 8.968889
      },
      {
        "Name": "OUED MLIZ",
        "NameAr": "ÙˆØ§Ø¯ÙŠ Ù…Ù„ÙŠØ²",
        "Value": "OUED MLIZ",
        "PostalCode": "8193",
        "Latitude": 36.466667,
        "Longitude": 8.550000
      },
      {
        "Name": "GHARDIMAOU",
        "NameAr": "ØºØ§Ø± Ø§Ù„Ø¯Ù…Ø§Ø¡",
        "Value": "GHARDIMAOU",
        "PostalCode": "8160",
        "Latitude": 36.479444,
        "Longitude": 8.439722
      }
    ]
  },
  {
    "Name": "KAIROUAN",
    "NameAr": "Ø§Ù„Ù‚ÙŠØ±ÙˆØ§Ù†",
    "Value": "KAIROUAN",
    "Delegations": [
      {
        "Name": "CHEBIKA",
        "NameAr": "Ø§Ù„Ø´Ø¨ÙŠÙƒØ©",
        "Value": "CHEBIKA",
        "PostalCode": "3121",
        "Latitude": 35.683333,
        "Longitude": 9.750000
      },
      {
        "Name": "EL ALA",
        "NameAr": "Ø§Ù„Ø¹Ù„Ø§",
        "Value": "EL ALA",
        "PostalCode": "3154",
        "Latitude": 35.608333,
        "Longitude": 9.550000
      },
      {
        "Name": "OUESLATIA",
        "NameAr": "Ø§Ù„ÙˆØ³Ù„Ø§ØªÙŠØ©",
        "Value": "OUESLATIA",
        "PostalCode": "3124",
        "Latitude": 35.850000,
        "Longitude": 9.600000
      },
      {
        "Name": "HAJEB EL AYOUN",
        "NameAr": "Ø­Ø§Ø¬Ø¨ Ø§Ù„Ø¹ÙŠÙˆÙ†",
        "Value": "HAJEB EL AYOUN",
        "PostalCode": "3160",
        "Latitude": 35.383333,
        "Longitude": 9.550000
      },
      {
        "Name": "SBIKHA",
        "NameAr": "Ø§Ù„Ø³Ø¨ÙŠØ®Ø©",
        "Value": "SBIKHA",
        "PostalCode": "3125",
        "Latitude": 35.933333,
        "Longitude": 10.000000
      },
      {
        "Name": "BOU HAJLA",
        "NameAr": "Ø¨ÙˆØ­Ø¬Ù„Ø©",
        "Value": "BOU HAJLA",
        "PostalCode": "3126",
        "Latitude": 35.250000,
        "Longitude": 10.016667
      },
      {
        "Name": "KAIROUAN NORD",
        "NameAr": "Ø§Ù„Ù‚ÙŠØ±ÙˆØ§Ù† Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        "Value": "KAIROUAN NORD",
        "PostalCode": "3129",
        "Latitude": 35.678056,
        "Longitude": 10.096306
      },
      {
        "Name": "HAFFOUZ",
        "NameAr": "Ø­ÙÙˆØ²",
        "Value": "HAFFOUZ",
        "PostalCode": "3130",
        "Latitude": 35.633333,
        "Longitude": 9.666667
      },
      {
        "Name": "KAIROUAN SUD",
        "NameAr": "Ø§Ù„Ù‚ÙŠØ±ÙˆØ§Ù† Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "KAIROUAN SUD",
        "PostalCode": "3131",
        "Latitude": 35.678056,
        "Longitude": 10.096306
      },
      {
        "Name": "NASRALLAH",
        "NameAr": "Ù†ØµØ± Ø§Ù„Ù„Ù‡",
        "Value": "NASRALLAH",
        "PostalCode": "3170",
        "Latitude": 35.050000,
        "Longitude": 9.733333
      },
      {
        "Name": "CHERARDA",
        "NameAr": "Ø§Ù„Ø´Ø±Ø§Ø±Ø¯Ø©",
        "Value": "CHERARDA",
        "PostalCode": "3145",
        "Latitude": 35.452222,
        "Longitude": 10.230000
      }
    ]
  },
  {
    "Name": "KASSERINE",
    "NameAr": "Ø§Ù„Ù‚ØµØ±ÙŠÙ†",
    "Value": "KASSERINE",
    "Delegations": [
      {
        "Name": "SBEITLA",
        "NameAr": "Ø³Ø¨ÙŠØ·Ù„Ø©",
        "Value": "SBEITLA",
        "PostalCode": "1250",
        "Latitude": 35.233333,
        "Longitude": 9.133333
      },
      {
        "Name": "FOUSSANA",
        "NameAr": "ÙÙˆØ³Ø§Ù†Ø©",
        "Value": "FOUSSANA",
        "PostalCode": "1220",
        "Latitude": 35.100000,
        "Longitude": 8.666667
      },
      {
        "Name": "KASSERINE NORD",
        "NameAr": "Ø§Ù„Ù‚ØµØ±ÙŠÙ† Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        "Value": "KASSERINE NORD",
        "PostalCode": "1253",
        "Latitude": 35.167600,
        "Longitude": 8.830200
      },
      {
        "Name": "HAIDRA",
        "NameAr": "Ø­ÙŠØ¯Ø±Ø©",
        "Value": "HAIDRA",
        "PostalCode": "1221",
        "Latitude": 35.562500,
        "Longitude": 8.494444
      },
      {
        "Name": "THALA",
        "NameAr": "ØªØ§Ù„Ø©",
        "Value": "THALA",
        "PostalCode": "1210",
        "Latitude": 35.575000,
        "Longitude": 8.672222
      },
      {
        "Name": "SBIBA",
        "NameAr": "Ø³Ø¨ÙŠØ¨Ø©",
        "Value": "SBIBA",
        "PostalCode": "1270",
        "Latitude": 35.550000,
        "Longitude": 9.066667
      },
      {
        "Name": "FERIANA",
        "NameAr": "ÙØ±ÙŠØ§Ù†Ø©",
        "Value": "FERIANA",
        "PostalCode": "1240",
        "Latitude": 34.950000,
        "Longitude": 8.583333
      },
      {
        "Name": "MEJEL BEL ABBES",
        "NameAr": "Ù…Ø§Ø¬Ù„ Ø¨Ù„Ø¹Ø¨Ø§Ø³",
        "Value": "MEJEL BEL ABBES",
        "PostalCode": "1226",
        "Latitude": 34.800000,
        "Longitude": 8.833333
      },
      {
        "Name": "KASSERINE SUD",
        "NameAr": "Ø§Ù„Ù‚ØµØ±ÙŠÙ† Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "KASSERINE SUD",
        "PostalCode": "1233",
        "Latitude": 35.167600,
        "Longitude": 8.830200
      },
      {
        "Name": "EL AYOUN",
        "NameAr": "Ø§Ù„Ø¹ÙŠÙˆÙ†",
        "Value": "EL AYOUN",
        "PostalCode": "1234",
        "Latitude": 35.383333,
        "Longitude": 8.700000
      },
      {
        "Name": "EZZOUHOUR  (KASSERINE)",
        "NameAr": "Ø§Ù„Ø²Ù‡ÙˆØ± (Ø§Ù„Ù‚ØµØ±ÙŠÙ†)",
        "Value": "EZZOUHOUR  (KASSERINE)",
        "PostalCode": "1279",
        "Latitude": 35.183300,
        "Longitude": 8.800000
      },
      {
        "Name": "JEDILIANE",
        "NameAr": "Ø¬Ø¯Ù„ÙŠØ§Ù†",
        "Value": "JEDILIANE",
        "PostalCode": "1280",
        "Latitude": 35.616667,
        "Longitude": 9.183333
      },
      {
        "Name": "HASSI EL FRID",
        "NameAr": "Ø­Ø§Ø³ÙŠ Ø§Ù„ÙØ±ÙŠØ¯",
        "Value": "HASSI EL FRID",
        "PostalCode": "1241",
        "Latitude": 34.933333,
        "Longitude": 9.000000
      }
    ]
  },
  {
    "Name": "KEBILI",
    "NameAr": "Ù‚Ø¨Ù„ÙŠ",
    "Value": "KEBILI",
    "Delegations": [
      {
        "Name": "SOUK EL AHAD",
        "NameAr": "Ø³ÙˆÙ‚ Ø§Ù„Ø£Ø­Ø¯",
        "Value": "SOUK EL AHAD",
        "PostalCode": "4223",
        "Latitude": 33.700000,
        "Longitude": 8.950000
      },
      {
        "Name": "KEBILI SUD",
        "NameAr": "Ù‚Ø¨Ù„ÙŠ Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "KEBILI SUD",
        "PostalCode": "4224",
        "Latitude": 33.705111,
        "Longitude": 8.872306
      },
      {
        "Name": "KEBILI NORD",
        "NameAr": "Ù‚Ø¨Ù„ÙŠ Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        "Value": "KEBILI NORD",
        "PostalCode": "4232",
        "Latitude": 33.705111,
        "Longitude": 8.872306
      },
      {
        "Name": "DOUZ",
        "NameAr": "Ø¯ÙˆØ²",
        "Value": "DOUZ",
        "PostalCode": "4234",
        "Latitude": 33.458889,
        "Longitude": 9.025556
      },
      {
        "Name": "EL FAOUAR",
        "NameAr": "Ø§Ù„ÙÙˆØ§Ø±",
        "Value": "EL FAOUAR",
        "PostalCode": "4264",
        "Latitude": 33.350000,
        "Longitude": 8.616667
      }
    ]
  },
  {
    "Name": "KEF",
    "NameAr": "Ø§Ù„ÙƒØ§Ù",
    "Value": "KEF",
    "Delegations": [
      {
        "Name": "TAJEROUINE",
        "NameAr": "ØªØ§Ø¬Ø±ÙˆÙŠÙ†",
        "Value": "TAJEROUINE",
        "PostalCode": "7150",
        "Latitude": 35.883333,
        "Longitude": 8.616667
      },
      {
        "Name": "DAHMANI",
        "NameAr": "Ø§Ù„Ø¯Ù‡Ù…Ø§Ù†ÙŠ",
        "Value": "DAHMANI",
        "PostalCode": "7170",
        "Latitude": 35.950000,
        "Longitude": 8.816667
      },
      {
        "Name": "LE KEF EST",
        "NameAr": "Ø§Ù„ÙƒØ§Ù Ø§Ù„Ø´Ø±Ù‚ÙŠØ©",
        "Value": "LE KEF EST",
        "PostalCode": "7100",
        "Latitude": 36.180278,
        "Longitude": 8.711111
      },
      {
        "Name": "SAKIET SIDI YOUSSEF",
        "NameAr": "Ø³Ø§Ù‚ÙŠØ© Ø³ÙŠØ¯ÙŠ ÙŠÙˆØ³Ù",
        "Value": "SAKIET SIDI YOUSSEF",
        "PostalCode": "7120",
        "Latitude": 36.350000,
        "Longitude": 8.350000
      },
      {
        "Name": "LE SERS",
        "NameAr": "Ø§Ù„Ø³Ø±Ø³",
        "Value": "LE SERS",
        "PostalCode": "7180",
        "Latitude": 36.083333,
        "Longitude": 9.033333
      },
      {
        "Name": "NEBEUR",
        "NameAr": "Ù†Ø¨Ø±",
        "Value": "NEBEUR",
        "PostalCode": "7110",
        "Latitude": 36.366667,
        "Longitude": 8.816667
      },
      {
        "Name": "TOUIREF",
        "NameAr": "Ø§Ù„Ø·ÙˆÙŠØ±Ù",
        "Value": "TOUIREF",
        "PostalCode": "7112",
        "Latitude": 36.283333,
        "Longitude": 8.550000
      },
      {
        "Name": "EL KSOUR",
        "NameAr": "Ø§Ù„Ù‚ØµÙˆØ±",
        "Value": "EL KSOUR",
        "PostalCode": "7160",
        "Latitude": 35.800000,
        "Longitude": 8.866667
      },
      {
        "Name": "KALAA EL KHASBA",
        "NameAr": "Ø§Ù„Ù‚Ù„Ø¹Ø© Ø§Ù„Ø®ØµØ¨Ø§Ø¡",
        "Value": "KALAA EL KHASBA",
        "PostalCode": "7123",
        "Latitude": 35.633333,
        "Longitude": 8.450000
      },
      {
        "Name": "KALAAT SINANE",
        "NameAr": "Ù‚Ù„Ø¹Ø© Ø³Ù†Ø§Ù†",
        "Value": "KALAAT SINANE",
        "PostalCode": "7130",
        "Latitude": 35.950000,
        "Longitude": 8.466667
      },
      {
        "Name": "JERISSA",
        "NameAr": "Ø§Ù„Ø¬Ø±ÙŠØµØ©",
        "Value": "JERISSA",
        "PostalCode": "7114",
        "Latitude": 35.866667,
        "Longitude": 8.633333
      },
      {
        "Name": "LE KEF OUEST",
        "NameAr": "Ø§Ù„ÙƒØ§Ù Ø§Ù„ØºØ±Ø¨ÙŠØ©",
        "Value": "LE KEF OUEST",
        "PostalCode": "7117",
        "Latitude": 36.180278,
        "Longitude": 8.711111
      }
    ]
  },
  {
    "Name": "MAHDIA",
    "NameAr": "Ø§Ù„Ù…Ù‡Ø¯ÙŠØ©",
    "Value": "MAHDIA",
    "Delegations": [
      {
        "Name": "MAHDIA",
        "NameAr": "Ø§Ù„Ù…Ù‡Ø¯ÙŠØ©",
        "Value": "MAHDIA",
        "PostalCode": "5111",
        "Latitude": 35.504722,
        "Longitude": 11.062222
      },
      {
        "Name": "CHORBANE",
        "NameAr": "Ø´Ø±Ø¨Ø§Ù†",
        "Value": "CHORBANE",
        "PostalCode": "5130",
        "Latitude": 35.266667,
        "Longitude": 10.516667
      },
      {
        "Name": "EL JEM",
        "NameAr": "Ø§Ù„Ø¬Ù…",
        "Value": "EL JEM",
        "PostalCode": "5160",
        "Latitude": 35.296389,
        "Longitude": 10.711111
      },
      {
        "Name": "LA CHEBBA",
        "NameAr": "Ø§Ù„Ø´Ø§Ø¨Ø©",
        "Value": "LA CHEBBA",
        "PostalCode": "5170",
        "Latitude": 35.233333,
        "Longitude": 11.116667
      },
      {
        "Name": "BOU MERDES",
        "NameAr": "Ø¨ÙˆÙ…Ø±Ø¯Ø§Ø³",
        "Value": "BOU MERDES",
        "PostalCode": "5112",
        "Latitude": 35.550000,
        "Longitude": 10.766667
      },
      {
        "Name": "KSOUR ESSAF",
        "NameAr": "Ù‚ØµÙˆØ± Ø§Ù„Ø³Ø§Ù",
        "Value": "KSOUR ESSAF",
        "PostalCode": "5180",
        "Latitude": 35.426667,
        "Longitude": 10.990000
      },
      {
        "Name": "SIDI ALOUENE",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ø¹Ù„ÙˆØ§Ù†",
        "Value": "SIDI ALOUENE",
        "PostalCode": "5132",
        "Latitude": 35.350000,
        "Longitude": 10.816667
      },
      {
        "Name": "HBIRA",
        "NameAr": "Ù‡Ø¨ÙŠØ±Ø©",
        "Value": "HBIRA",
        "PostalCode": "5113",
        "Latitude": 35.116667,
        "Longitude": 10.400000
      },
      {
        "Name": "MELLOULECH",
        "NameAr": "Ù…Ù„ÙˆÙ„Ø´",
        "Value": "MELLOULECH",
        "PostalCode": "5114",
        "Latitude": 35.316667,
        "Longitude": 11.016667
      },
      {
        "Name": "SOUASSI",
        "NameAr": "Ø§Ù„Ø³ÙˆØ§Ø³ÙŠ",
        "Value": "SOUASSI",
        "PostalCode": "5134",
        "Latitude": 35.350000,
        "Longitude": 10.483333
      },
      {
        "Name": "OULED CHAMAKH",
        "NameAr": "Ø£ÙˆÙ„Ø§Ø¯ Ø§Ù„Ø´Ø§Ù…Ø®",
        "Value": "OULED CHAMAKH",
        "PostalCode": "5120",
        "Latitude": 35.400000,
        "Longitude": 10.300000
      }
    ]
  },
  {
    "Name": "MANNOUBA",
    "NameAr": "Ù…Ù†ÙˆØ¨Ø©",
    "Value": "MANNOUBA",
    "Delegations": [
      {
        "Name": "TEBOURBA",
        "NameAr": "Ø·Ø¨Ø±Ø¨Ø©",
        "Value": "TEBOURBA",
        "PostalCode": "1144",
        "Latitude": 36.829167,
        "Longitude": 9.841667
      },
      {
        "Name": "JEDAIDA",
        "NameAr": "Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©",
        "Value": "JEDAIDA",
        "PostalCode": "1124",
        "Latitude": 36.808333,
        "Longitude": 9.933333
      },
      {
        "Name": "MORNAGUIA",
        "NameAr": "Ø§Ù„Ù…Ø±Ù†Ø§Ù‚ÙŠØ©",
        "Value": "MORNAGUIA",
        "PostalCode": "1110",
        "Latitude": 36.766667,
        "Longitude": 9.933333
      },
      {
        "Name": "BORJ EL AMRI",
        "NameAr": "Ø¨Ø±Ø¬ Ø§Ù„Ø¹Ø§Ù…Ø±ÙŠ",
        "Value": "BORJ EL AMRI",
        "PostalCode": "1113",
        "Latitude": 36.750000,
        "Longitude": 9.833333
      },
      {
        "Name": "EL BATTAN",
        "NameAr": "Ø§Ù„Ø¨Ø·Ø§Ù†",
        "Value": "EL BATTAN",
        "PostalCode": "1114",
        "Latitude": 36.800000,
        "Longitude": 9.866667
      },
      {
        "Name": "OUED ELLIL",
        "NameAr": "ÙˆØ§Ø¯ÙŠ Ø§Ù„Ù„ÙŠÙ„",
        "Value": "OUED ELLIL",
        "PostalCode": "2021",
        "Latitude": 36.833333,
        "Longitude": 10.050000
      },
      {
        "Name": "DOUAR HICHER",
        "NameAr": "Ø¯ÙˆØ§Ø± Ù‡ÙŠØ´Ø±",
        "Value": "DOUAR HICHER",
        "PostalCode": "2086",
        "Latitude": 36.835000,
        "Longitude": 10.066667
      },
      {
        "Name": "MANNOUBA",
        "NameAr": "Ù…Ù†ÙˆØ¨Ø©",
        "Value": "MANNOUBA",
        "PostalCode": "2010",
        "Latitude": 36.813500,
        "Longitude": 10.095800
      }
    ]
  },
  {
    "Name": "MEDENINE",
    "NameAr": "Ù…Ø¯Ù†ÙŠÙ†",
    "Value": "MEDENINE",
    "Delegations": [
      {
        "Name": "HOUMET ESSOUK",
        "NameAr": "Ø­ÙˆÙ…Ø© Ø§Ù„Ø³ÙˆÙ‚",
        "Value": "HOUMET ESSOUK",
        "PostalCode": "4180",
        "Latitude": 33.875000,
        "Longitude": 10.858333
      },
      {
        "Name": "BENI KHEDACHE",
        "NameAr": "Ø¨Ù†ÙŠ Ø®Ø¯Ø§Ø´",
        "Value": "BENI KHEDACHE",
        "PostalCode": "4110",
        "Latitude": 33.250000,
        "Longitude": 10.200000
      },
      {
        "Name": "AJIM",
        "NameAr": "Ø£Ø¬ÙŠÙ…",
        "Value": "AJIM",
        "PostalCode": "4150",
        "Latitude": 33.720556,
        "Longitude": 10.751944
      },
      {
        "Name": "BEN GUERDANE",
        "NameAr": "Ø¨Ù†Ù‚Ø±Ø¯Ø§Ù†",
        "Value": "BEN GUERDANE",
        "PostalCode": "4153",
        "Latitude": 33.133333,
        "Longitude": 11.216667
      },
      {
        "Name": "ZARZIS",
        "NameAr": "Ø¬Ø±Ø¬ÙŠØ³",
        "Value": "ZARZIS",
        "PostalCode": "4154",
        "Latitude": 33.503889,
        "Longitude": 11.112222
      },
      {
        "Name": "MEDENINE NORD",
        "NameAr": "Ù…Ø¯Ù†ÙŠÙ† Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        "Value": "MEDENINE NORD",
        "PostalCode": "4111",
        "Latitude": 33.355000,
        "Longitude": 10.505278
      },
      {
        "Name": "MIDOUN",
        "NameAr": "Ù…ÙŠØ¯ÙˆÙ†",
        "Value": "MIDOUN",
        "PostalCode": "4113",
        "Latitude": 33.804722,
        "Longitude": 10.964722
      },
      {
        "Name": "SIDI MAKHLOUF",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ù…Ø®Ù„ÙˆÙ",
        "Value": "SIDI MAKHLOUF",
        "PostalCode": "4181",
        "Latitude": 33.566667,
        "Longitude": 10.450000
      },
      {
        "Name": "MEDENINE SUD",
        "NameAr": "Ù…Ø¯Ù†ÙŠÙ† Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "MEDENINE SUD",
        "PostalCode": "4127",
        "Latitude": 33.355000,
        "Longitude": 10.505278
      }
    ]
  },
  {
    "Name": "MONASTIR",
    "NameAr": "Ø§Ù„Ù…Ù†Ø³ØªÙŠØ±",
    "Value": "MONASTIR",
    "Delegations": [
      {
        "Name": "MONASTIR",
        "NameAr": "Ø§Ù„Ù…Ù†Ø³ØªÙŠØ±",
        "Value": "MONASTIR",
        "PostalCode": "5060",
        "Latitude": 35.764298,
        "Longitude": 10.809098
      },
      {
        "Name": "SAHLINE",
        "NameAr": "Ø§Ù„Ø³Ø§Ø­Ù„ÙŠÙ†",
        "Value": "SAHLINE",
        "PostalCode": "5012",
        "Latitude": 35.750000,
        "Longitude": 10.733333
      },
      {
        "Name": "KSIBET EL MEDIOUNI",
        "NameAr": "Ù‚ØµÙŠØ¨Ø© Ø§Ù„Ù…Ø¯ÙŠÙˆÙ†ÙŠ",
        "Value": "KSIBET EL MEDIOUNI",
        "PostalCode": "5031",
        "Latitude": 35.666667,
        "Longitude": 10.800000
      },
      {
        "Name": "JEMMAL",
        "NameAr": "Ø¬Ù…Ø§Ù„",
        "Value": "JEMMAL",
        "PostalCode": "5013",
        "Latitude": 35.625000,
        "Longitude": 10.754167
      },
      {
        "Name": "BENI HASSEN",
        "NameAr": "Ø¨Ù†ÙŠ Ø­Ø³Ø§Ù†",
        "Value": "BENI HASSEN",
        "PostalCode": "5014",
        "Latitude": 35.566667,
        "Longitude": 10.733333
      },
      {
        "Name": "SAYADA LAMTA BOU HAJAR",
        "NameAr": "ØµÙŠØ§Ø¯Ø© Ù„Ù…Ø·Ø© Ø¨ÙˆØ­Ø¬Ø±",
        "Value": "SAYADA LAMTA BOU HAJAR",
        "PostalCode": "5015",
        "Latitude": 35.666667,
        "Longitude": 10.883333
      },
      {
        "Name": "TEBOULBA",
        "NameAr": "Ø·Ø¨Ù„Ø¨Ø©",
        "Value": "TEBOULBA",
        "PostalCode": "5066",
        "Latitude": 35.640556,
        "Longitude": 10.961389
      },
      {
        "Name": "KSAR HELAL",
        "NameAr": "Ù‚ØµØ± Ù‡Ù„Ø§Ù„",
        "Value": "KSAR HELAL",
        "PostalCode": "5016",
        "Latitude": 35.644167,
        "Longitude": 10.892778
      },
      {
        "Name": "BEMBLA",
        "NameAr": "Ø¨Ù†Ø¨Ù„Ø©",
        "Value": "BEMBLA",
        "PostalCode": "5032",
        "Latitude": 35.700000,
        "Longitude": 10.783333
      },
      {
        "Name": "ZERAMDINE",
        "NameAr": "Ø²Ø±Ù…Ø¯ÙŠÙ†",
        "Value": "ZERAMDINE",
        "PostalCode": "5033",
        "Latitude": 35.583333,
        "Longitude": 10.700000
      },
      {
        "Name": "MOKNINE",
        "NameAr": "Ø§Ù„Ù…ÙƒÙ†ÙŠÙ†",
        "Value": "MOKNINE",
        "PostalCode": "5034",
        "Latitude": 35.630556,
        "Longitude": 10.900000
      },
      {
        "Name": "OUERDANINE",
        "NameAr": "Ø§Ù„ÙˆØ±Ø¯Ø§Ù†ÙŠÙ†",
        "Value": "OUERDANINE",
        "PostalCode": "5041",
        "Latitude": 35.783333,
        "Longitude": 10.683333
      },
      {
        "Name": "BEKALTA",
        "NameAr": "Ø§Ù„Ø¨Ù‚Ø§Ù„Ø·Ø©",
        "Value": "BEKALTA",
        "PostalCode": "5090",
        "Latitude": 35.616667,
        "Longitude": 11.033333
      }
    ]
  },
  {
    "Name": "NABEUL",
    "NameAr": "Ù†Ø§Ø¨Ù„",
    "Value": "NABEUL",
    "Delegations": [
      {
        "Name": "BENI KHIAR",
        "NameAr": "Ø¨Ù†ÙŠ Ø®ÙŠØ§Ø±",
        "Value": "BENI KHIAR",
        "PostalCode": "8023",
        "Latitude": 36.466667,
        "Longitude": 10.783333
      },
      {
        "Name": "TAKELSA",
        "NameAr": "ØªØ§ÙƒÙ„Ø³Ø©",
        "Value": "TAKELSA",
        "PostalCode": "8031",
        "Latitude": 36.783333,
        "Longitude": 10.633333
      },
      {
        "Name": "EL MIDA",
        "NameAr": "Ø§Ù„Ù…ÙŠØ¯Ø©",
        "Value": "EL MIDA",
        "PostalCode": "8044",
        "Latitude": 36.733333,
        "Longitude": 10.916667
      },
      {
        "Name": "MENZEL BOUZELFA",
        "NameAr": "Ù…Ù†Ø²Ù„ Ø¨ÙˆØ²Ù„ÙØ©",
        "Value": "MENZEL BOUZELFA",
        "PostalCode": "8010",
        "Latitude": 36.683333,
        "Longitude": 10.583333
      },
      {
        "Name": "KELIBIA",
        "NameAr": "Ù‚Ù„ÙŠØ¨ÙŠØ©",
        "Value": "KELIBIA",
        "PostalCode": "8090",
        "Latitude": 36.846111,
        "Longitude": 11.097500
      },
      {
        "Name": "HAMMAMET",
        "NameAr": "Ø§Ù„Ø­Ù…Ø§Ù…Ø§Øª",
        "Value": "HAMMAMET",
        "PostalCode": "8032",
        "Latitude": 36.400000,
        "Longitude": 10.616667
      },
      {
        "Name": "BOU ARGOUB",
        "NameAr": "Ø¨ÙˆØ¹Ø±Ù‚ÙˆØ¨",
        "Value": "BOU ARGOUB",
        "PostalCode": "8061",
        "Latitude": 36.550000,
        "Longitude": 10.550000
      },
      {
        "Name": "KORBA",
        "NameAr": "Ù‚Ø±Ø¨Ø©",
        "Value": "KORBA",
        "PostalCode": "8033",
        "Latitude": 36.575278,
        "Longitude": 10.862222
      },
      {
        "Name": "MENZEL TEMIME",
        "NameAr": "Ù…Ù†Ø²Ù„ ØªÙ…ÙŠÙ…",
        "Value": "MENZEL TEMIME",
        "PostalCode": "8034",
        "Latitude": 36.783333,
        "Longitude": 10.983333
      },
      {
        "Name": "NABEUL",
        "NameAr": "Ù†Ø§Ø¨Ù„",
        "Value": "NABEUL",
        "PostalCode": "8062",
        "Latitude": 36.456065,
        "Longitude": 10.734616
      },
      {
        "Name": "EL HAOUARIA",
        "NameAr": "Ø§Ù„Ù‡ÙˆØ§Ø±ÙŠØ©",
        "Value": "EL HAOUARIA",
        "PostalCode": "8036",
        "Latitude": 37.050000,
        "Longitude": 11.016667
      },
      {
        "Name": "HAMMAM EL GHEZAZ",
        "NameAr": "Ø­Ù…Ø§Ù… Ø§Ù„Ø£ØºØ²Ø§Ø²",
        "Value": "HAMMAM EL GHEZAZ",
        "PostalCode": "8025",
        "Latitude": 36.966667,
        "Longitude": 11.116667
      },
      {
        "Name": "SOLIMAN",
        "NameAr": "Ø³Ù„ÙŠÙ…Ø§Ù†",
        "Value": "SOLIMAN",
        "PostalCode": "8063",
        "Latitude": 36.700000,
        "Longitude": 10.483333
      },
      {
        "Name": "GROMBALIA",
        "NameAr": "Ù‚Ø±Ù…Ø¨Ø§Ù„ÙŠØ©",
        "Value": "GROMBALIA",
        "PostalCode": "8092",
        "Latitude": 36.600000,
        "Longitude": 10.500000
      },
      {
        "Name": "DAR CHAABANE ELFEHRI",
        "NameAr": "Ø¯Ø§Ø± Ø´Ø¹Ø¨Ø§Ù† Ø§Ù„ÙÙ‡Ø±ÙŠ",
        "Value": "DAR CHAABANE ELFEHRI",
        "PostalCode": "8011",
        "Latitude": 36.473333,
        "Longitude": 10.755833
      },
      {
        "Name": "BENI KHALLED",
        "NameAr": "Ø¨Ù†ÙŠ Ø®Ù„Ø§Ø¯",
        "Value": "BENI KHALLED",
        "PostalCode": "8099",
        "Latitude": 36.650000,
        "Longitude": 10.600000
      }
    ]
  },
  {
    "Name": "SFAX",
    "NameAr": "ØµÙØ§Ù‚Ø³",
    "Value": "SFAX",
    "Delegations": [
      {
        "Name": "AGAREB",
        "NameAr": "Ø¹Ù‚Ø§Ø±Ø¨",
        "Value": "AGAREB",
        "PostalCode": "3030",
        "Latitude": 34.733333,
        "Longitude": 10.516667
      },
      {
        "Name": "EL HENCHA",
        "NameAr": "Ø§Ù„Ø­Ù†Ø´Ø©",
        "Value": "EL HENCHA",
        "PostalCode": "3043",
        "Latitude": 35.233333,
        "Longitude": 10.600000
      },
      {
        "Name": "SFAX EST",
        "NameAr": "ØµÙØ§Ù‚Ø³ Ø§Ù„Ø´Ø±Ù‚ÙŠØ©",
        "Value": "SFAX EST",
        "PostalCode": "3064",
        "Latitude": 34.740000,
        "Longitude": 10.760000
      },
      {
        "Name": "SFAX SUD",
        "NameAr": "ØµÙØ§Ù‚Ø³ Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "SFAX SUD",
        "PostalCode": "3083",
        "Latitude": 34.740000,
        "Longitude": 10.760000
      },
      {
        "Name": "MAHRAS",
        "NameAr": "Ø§Ù„Ù…Ø­Ø±Ø³",
        "Value": "MAHRAS",
        "PostalCode": "3044",
        "Latitude": 34.527778,
        "Longitude": 10.505556
      },
      {
        "Name": "SFAX VILLE",
        "NameAr": "ØµÙØ§Ù‚Ø³ Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©",
        "Value": "SFAX VILLE",
        "PostalCode": "3065",
        "Latitude": 34.737500,
        "Longitude": 10.757778
      },
      {
        "Name": "EL AMRA",
        "NameAr": "Ø§Ù„Ø¹Ø§Ù…Ø±Ø©",
        "Value": "EL AMRA",
        "PostalCode": "3066",
        "Latitude": 34.900000,
        "Longitude": 10.616667
      },
      {
        "Name": "BIR ALI BEN KHELIFA",
        "NameAr": "Ø¨Ø¦Ø± Ø¹Ù„ÙŠ Ø¨Ù† Ø®Ù„ÙŠÙØ©",
        "Value": "BIR ALI BEN KHELIFA",
        "PostalCode": "3085",
        "Latitude": 34.833333,
        "Longitude": 10.066667
      },
      {
        "Name": "KERKENAH",
        "NameAr": "Ù‚Ø±Ù‚Ù†Ø©",
        "Value": "KERKENAH",
        "PostalCode": "3045",
        "Latitude": 34.720833,
        "Longitude": 11.150000
      },
      {
        "Name": "SAKIET EDDAIER",
        "NameAr": "Ø³Ø§Ù‚ÙŠØ© Ø§Ù„Ø¯Ø§ÙŠØ±",
        "Value": "SAKIET EDDAIER",
        "PostalCode": "3011",
        "Latitude": 34.816667,
        "Longitude": 10.766667
      },
      {
        "Name": "JEBENIANA",
        "NameAr": "Ø¬Ø¨Ù†ÙŠØ§Ù†Ø©",
        "Value": "JEBENIANA",
        "PostalCode": "3086",
        "Latitude": 35.033333,
        "Longitude": 10.900000
      },
      {
        "Name": "SAKIET EZZIT",
        "NameAr": "Ø³Ø§Ù‚ÙŠØ© Ø§Ù„Ø²ÙŠØª",
        "Value": "SAKIET EZZIT",
        "PostalCode": "3091",
        "Latitude": 34.794444,
        "Longitude": 10.743333
      },
      {
        "Name": "MENZEL CHAKER",
        "NameAr": "Ù…Ù†Ø²Ù„ Ø´Ø§ÙƒØ±",
        "Value": "MENZEL CHAKER",
        "PostalCode": "3092",
        "Latitude": 34.966667,
        "Longitude": 10.366667
      },
      {
        "Name": "ESSKHIRA",
        "NameAr": "Ø§Ù„ØµØ®ÙŠØ±Ø©",
        "Value": "ESSKHIRA",
        "PostalCode": "3050",
        "Latitude": 34.291667,
        "Longitude": 10.072222
      },
      {
        "Name": "GHRAIBA",
        "NameAr": "Ø§Ù„ØºØ±ÙŠØ¨Ø©",
        "Value": "GHRAIBA",
        "PostalCode": "3034",
        "Latitude": 34.550000,
        "Longitude": 10.166667
      }
    ]
  },
  {
    "Name": "SIDI BOUZID",
    "NameAr": "Ø³ÙŠØ¯ÙŠ Ø¨ÙˆØ²ÙŠØ¯",
    "Value": "SIDI_BOUZID",
    "Delegations": [
      {
        "Name": "MENZEL BOUZAIENE",
        "NameAr": "Ù…Ù†Ø²Ù„ Ø¨ÙˆØ²ÙŠØ§Ù†",
        "Value": "MENZEL BOUZAIENE",
        "PostalCode": "9114",
        "Latitude": 34.783333,
        "Longitude": 9.250000
      },
      {
        "Name": "SIDI BOUZID OUEST",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ø¨ÙˆØ²ÙŠØ¯ Ø§Ù„ØºØ±Ø¨ÙŠØ©",
        "Value": "SIDI BOUZID OUEST",
        "PostalCode": "9131",
        "Latitude": 35.037222,
        "Longitude": 9.484722
      },
      {
        "Name": "BEN OUN",
        "NameAr": "Ø¨Ù† Ø¹ÙˆÙ†",
        "Value": "BEN OUN",
        "PostalCode": "9169",
        "Latitude": 34.866667,
        "Longitude": 9.066667
      },
      {
        "Name": "SIDI BOUZID EST",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ø¨ÙˆØ²ÙŠØ¯ Ø§Ù„Ø´Ø±Ù‚ÙŠØ©",
        "Value": "SIDI BOUZID EST",
        "PostalCode": "9100",
        "Latitude": 35.037222,
        "Longitude": 9.484722
      },
      {
        "Name": "OULED HAFFOUZ",
        "NameAr": "Ø£ÙˆÙ„Ø§Ø¯ Ø­ÙÙˆØ²",
        "Value": "OULED HAFFOUZ",
        "PostalCode": "9180",
        "Latitude": 35.183333,
        "Longitude": 9.200000
      },
      {
        "Name": "REGUEB",
        "NameAr": "Ø§Ù„Ø±Ù‚Ø§Ø¨",
        "Value": "REGUEB",
        "PostalCode": "9115",
        "Latitude": 34.850000,
        "Longitude": 9.766667
      },
      {
        "Name": "MAKNASSY",
        "NameAr": "Ø§Ù„Ù…ÙƒÙ†Ø§Ø³ÙŠ",
        "Value": "MAKNASSY",
        "PostalCode": "9140",
        "Latitude": 34.600000,
        "Longitude": 9.600000
      },
      {
        "Name": "JILMA",
        "NameAr": "Ø¬Ù„Ù…Ø©",
        "Value": "JILMA",
        "PostalCode": "9110",
        "Latitude": 35.283333,
        "Longitude": 9.416667
      },
      {
        "Name": "SOUK JEDID",
        "NameAr": "Ø§Ù„Ø³ÙˆÙ‚ Ø§Ù„Ø¬Ø¯ÙŠØ¯",
        "Value": "SOUK JEDID",
        "PostalCode": "9121",
        "Latitude": 35.100000,
        "Longitude": 9.316667
      },
      {
        "Name": "MEZZOUNA",
        "NameAr": "Ø§Ù„Ù…Ø²ÙˆÙ†Ø©",
        "Value": "MEZZOUNA",
        "PostalCode": "9150",
        "Latitude": 34.516667,
        "Longitude": 9.833333
      },
      {
        "Name": "BIR EL HAFFEY",
        "NameAr": "Ø¨Ø¦Ø± Ø§Ù„Ø­ÙÙŠ",
        "Value": "BIR EL HAFFEY",
        "PostalCode": "9113",
        "Latitude": 34.933333,
        "Longitude": 9.200000
      },
      {
        "Name": "CEBBALA",
        "NameAr": "Ø§Ù„Ø³Ø¨Ø§Ù„Ø©",
        "Value": "CEBBALA",
        "PostalCode": "9122",
        "Latitude": 35.133333,
        "Longitude": 9.083333
      }
    ]
  },
  {
    "Name": "SILIANA",
    "NameAr": "Ø³Ù„ÙŠØ§Ù†Ø©",
    "Value": "SILIANA",
    "Delegations": [
      {
        "Name": "MAKTHAR",
        "NameAr": "Ù…ÙƒØ«Ø±",
        "Value": "MAKTHAR",
        "PostalCode": "6140",
        "Latitude": 35.850000,
        "Longitude": 9.200000
      },
      {
        "Name": "BOU ARADA",
        "NameAr": "Ø¨ÙˆØ¹Ø±Ø§Ø¯Ø©",
        "Value": "BOU ARADA",
        "PostalCode": "6180",
        "Latitude": 36.350000,
        "Longitude": 9.616667
      },
      {
        "Name": "SIDI BOU ROUIS",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ø¨ÙˆØ±ÙˆÙŠØ³",
        "Value": "SIDI BOU ROUIS",
        "PostalCode": "6113",
        "Latitude": 36.116667,
        "Longitude": 9.333333
      },
      {
        "Name": "KESRA",
        "NameAr": "ÙƒØ³Ø±Ù‰",
        "Value": "KESRA",
        "PostalCode": "6114",
        "Latitude": 35.816667,
        "Longitude": 9.366667
      },
      {
        "Name": "BARGOU",
        "NameAr": "Ø¨Ø±Ù‚Ùˆ",
        "Value": "BARGOU",
        "PostalCode": "6115",
        "Latitude": 36.083333,
        "Longitude": 9.600000
      },
      {
        "Name": "EL AROUSSA",
        "NameAr": "Ø§Ù„Ø¹Ø±ÙˆØ³Ø©",
        "Value": "EL AROUSSA",
        "PostalCode": "6116",
        "Latitude": 36.350000,
        "Longitude": 9.383333
      },
      {
        "Name": "LE KRIB",
        "NameAr": "Ø§Ù„ÙƒØ±ÙŠØ¨",
        "Value": "LE KRIB",
        "PostalCode": "6120",
        "Latitude": 36.283333,
        "Longitude": 9.183333
      },
      {
        "Name": "SILIANA NORD",
        "NameAr": "Ø³Ù„ÙŠØ§Ù†Ø© Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        "Value": "SILIANA NORD",
        "PostalCode": "6100",
        "Latitude": 36.084890,
        "Longitude": 9.370000
      },
      {
        "Name": "SILIANA SUD",
        "NameAr": "Ø³Ù„ÙŠØ§Ù†Ø© Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "SILIANA SUD",
        "PostalCode": "6143",
        "Latitude": 36.084890,
        "Longitude": 9.370000
      },
      {
        "Name": "ROHIA",
        "NameAr": "Ø§Ù„Ø±ÙˆØ­ÙŠØ©",
        "Value": "ROHIA",
        "PostalCode": "6150",
        "Latitude": 35.650000,
        "Longitude": 9.000000
      },
      {
        "Name": "GAAFOUR",
        "NameAr": "Ù‚Ø¹ÙÙˆØ±",
        "Value": "GAAFOUR",
        "PostalCode": "6121",
        "Latitude": 36.283333,
        "Longitude": 9.416667
      }
    ]
  },
  {
    "Name": "SOUSSE",
    "NameAr": "Ø³ÙˆØ³Ø©",
    "Value": "SOUSSE",
    "Delegations": [
      {
        "Name": "SIDI EL HENI",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ø§Ù„Ù‡Ø§Ù†ÙŠ",
        "Value": "SIDI EL HENI",
        "PostalCode": "4026",
        "Latitude": 35.666667,
        "Longitude": 10.300000
      },
      {
        "Name": "SOUSSE JAOUHARA",
        "NameAr": "Ø³ÙˆØ³Ø© Ø¬ÙˆÙ‡Ø±Ø©",
        "Value": "SOUSSE JAOUHARA",
        "PostalCode": "4054",
        "Latitude": 35.825354,
        "Longitude": 10.607995
      },
      {
        "Name": "BOU FICHA",
        "NameAr": "Ø¨ÙˆÙÙŠØ´Ø©",
        "Value": "BOU FICHA",
        "PostalCode": "4010",
        "Latitude": 36.266667,
        "Longitude": 10.400000
      },
      {
        "Name": "SOUSSE VILLE",
        "NameAr": "Ø³ÙˆØ³Ø© Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©",
        "Value": "SOUSSE VILLE",
        "PostalCode": "4059",
        "Latitude": 35.828828,
        "Longitude": 10.640036
      },
      {
        "Name": "ENFIDHA",
        "NameAr": "Ø§Ù„Ù†ÙÙŠØ¶Ø©",
        "Value": "ENFIDHA",
        "PostalCode": "4030",
        "Latitude": 36.133333,
        "Longitude": 10.383333
      },
      {
        "Name": "KALAA EL KEBIRA",
        "NameAr": "Ø§Ù„Ù‚Ù„Ø¹Ø© Ø§Ù„ÙƒØ¨Ø±Ù‰",
        "Value": "KALAA EL KEBIRA",
        "PostalCode": "4060",
        "Latitude": 35.866667,
        "Longitude": 10.533333
      },
      {
        "Name": "HAMMAM SOUSSE",
        "NameAr": "Ø­Ù…Ø§Ù… Ø³ÙˆØ³Ø©",
        "Value": "HAMMAM SOUSSE",
        "PostalCode": "4011",
        "Latitude": 35.861111,
        "Longitude": 10.597222
      },
      {
        "Name": "HERGLA",
        "NameAr": "Ù‡Ø±Ù‚Ù„Ø©",
        "Value": "HERGLA",
        "PostalCode": "4012",
        "Latitude": 36.033333,
        "Longitude": 10.500000
      },
      {
        "Name": "MSAKEN",
        "NameAr": "Ù…Ø³Ø§ÙƒÙ†",
        "Value": "MSAKEN",
        "PostalCode": "4013",
        "Latitude": 35.729444,
        "Longitude": 10.580000
      },
      {
        "Name": "SOUSSE RIADH",
        "NameAr": "Ø³ÙˆØ³Ø© Ø§Ù„Ø±ÙŠØ§Ø¶",
        "Value": "SOUSSE RIADH",
        "PostalCode": "4081",
        "Latitude": 35.809444,
        "Longitude": 10.591667
      },
      {
        "Name": "KONDAR",
        "NameAr": "ÙƒÙ†Ø¯Ø§Ø±",
        "Value": "KONDAR",
        "PostalCode": "4020",
        "Latitude": 35.933333,
        "Longitude": 10.316667
      },
      {
        "Name": "SIDI BOU ALI",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ø¨ÙˆØ¹Ù„ÙŠ",
        "Value": "SIDI BOU ALI",
        "PostalCode": "4040",
        "Latitude": 35.966667,
        "Longitude": 10.466667
      },
      {
        "Name": "KALAA ESSGHIRA",
        "NameAr": "Ø§Ù„Ù‚Ù„Ø¹Ø© Ø§Ù„ØµØºØ±Ù‰",
        "Value": "KALAA ESSGHIRA",
        "PostalCode": "4021",
        "Latitude": 35.833333,
        "Longitude": 10.566667
      },
      {
        "Name": "AKOUDA",
        "NameAr": "Ø£ÙƒÙˆØ¯Ø©",
        "Value": "AKOUDA",
        "PostalCode": "4022",
        "Latitude": 35.871111,
        "Longitude": 10.563889
      }
    ]
  },
  {
    "Name": "TATAOUINE",
    "NameAr": "ØªØ·Ø§ÙˆÙŠÙ†",
    "Value": "TATAOUINE",
    "Delegations": [
      {
        "Name": "TATAOUINE SUD",
        "NameAr": "ØªØ·Ø§ÙˆÙŠÙ† Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "TATAOUINE SUD",
        "PostalCode": "3200",
        "Latitude": 32.929722,
        "Longitude": 10.451389
      },
      {
        "Name": "SMAR",
        "NameAr": "Ø§Ù„ØµÙ…Ø§Ø±",
        "Value": "SMAR",
        "PostalCode": "3223",
        "Latitude": 33.116667,
        "Longitude": 10.783333
      },
      {
        "Name": "BIR LAHMAR",
        "NameAr": "Ø¨Ø¦Ø± Ø§Ù„Ø£Ø­Ù…Ø±",
        "Value": "BIR LAHMAR",
        "PostalCode": "3212",
        "Latitude": 33.200000,
        "Longitude": 10.583333
      },
      {
        "Name": "GHOMRASSEN",
        "NameAr": "ØºÙ…Ø±Ø§Ø³Ù†",
        "Value": "GHOMRASSEN",
        "PostalCode": "3224",
        "Latitude": 33.050000,
        "Longitude": 10.333333
      },
      {
        "Name": "TATAOUINE NORD",
        "NameAr": "ØªØ·Ø§ÙˆÙŠÙ† Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        "Value": "TATAOUINE NORD",
        "PostalCode": "3233",
        "Latitude": 32.929722,
        "Longitude": 10.451389
      },
      {
        "Name": "REMADA",
        "NameAr": "Ø±Ù…Ø§Ø¯Ø©",
        "Value": "REMADA",
        "PostalCode": "3240",
        "Latitude": 32.300000,
        "Longitude": 10.383333
      },
      {
        "Name": "DHEHIBA",
        "NameAr": "Ø§Ù„Ø°Ù‡ÙŠØ¨Ø©",
        "Value": "DHEHIBA",
        "PostalCode": "3253",
        "Latitude": 32.000000,
        "Longitude": 10.700000
      }
    ]
  },
  {
    "Name": "TOZEUR",
    "NameAr": "ØªÙˆØ²Ø±",
    "Value": "TOZEUR",
    "Delegations": [
      {
        "Name": "DEGUECHE",
        "NameAr": "Ø¯Ù‚Ø§Ø´",
        "Value": "DEGUECHE",
        "PostalCode": "2261",
        "Latitude": 33.966667,
        "Longitude": 8.216667
      },
      {
        "Name": "TOZEUR",
        "NameAr": "ØªÙˆØ²Ø±",
        "Value": "TOZEUR",
        "PostalCode": "2200",
        "Latitude": 33.919722,
        "Longitude": 8.133611
      },
      {
        "Name": "TAMEGHZA",
        "NameAr": "ØªÙ…ØºØ²Ø©",
        "Value": "TAMEGHZA",
        "PostalCode": "2211",
        "Latitude": 34.383333,
        "Longitude": 7.933333
      },
      {
        "Name": "HEZOUA",
        "NameAr": "Ø­Ø²ÙˆØ©",
        "Value": "HEZOUA",
        "PostalCode": "2223",
        "Latitude": 33.750000,
        "Longitude": 7.833333
      },
      {
        "Name": "NEFTA",
        "NameAr": "Ù†ÙØ·Ø©",
        "Value": "NEFTA",
        "PostalCode": "2240",
        "Latitude": 33.873056,
        "Longitude": 7.883333
      }
    ]
  },
  {
    "Name": "TUNIS",
    "NameAr": "ØªÙˆÙ†Ø³",
    "Value": "TUNIS",
    "Delegations": [
      {
        "Name": "JEBEL JELLOUD",
        "NameAr": "Ø¬Ø¨Ù„ Ø§Ù„Ø¬Ù„ÙˆØ¯",
        "Value": "JEBEL JELLOUD",
        "PostalCode": "1046",
        "Latitude": 36.775000,
        "Longitude": 10.195833
      },
      {
        "Name": "CARTHAGE",
        "NameAr": "Ù‚Ø±Ø·Ø§Ø¬",
        "Value": "CARTHAGE",
        "PostalCode": "2016",
        "Latitude": 36.853611,
        "Longitude": 10.332222
      },
      {
        "Name": "LA MARSA",
        "NameAr": "Ø§Ù„Ù…Ø±Ø³Ù‰",
        "Value": "LA MARSA",
        "PostalCode": "2076",
        "Latitude": 36.877600,
        "Longitude": 10.327800
      },
      {
        "Name": "BAB BHAR",
        "NameAr": "Ø¨Ø§Ø¨ Ø¨Ø­Ø±",
        "Value": "BAB BHAR",
        "PostalCode": "1000",
        "Latitude": 36.798333,
        "Longitude": 10.180000
      },
      {
        "Name": "LA GOULETTE",
        "NameAr": "Ø­Ù„Ù‚ Ø§Ù„ÙˆØ§Ø¯ÙŠ",
        "Value": "LA GOULETTE",
        "PostalCode": "2060",
        "Latitude": 36.818889,
        "Longitude": 10.300000
      },
      {
        "Name": "LE BARDO",
        "NameAr": "Ø¨Ø§Ø±Ø¯Ùˆ",
        "Value": "LE BARDO",
        "PostalCode": "2017",
        "Latitude": 36.809278,
        "Longitude": 10.139500
      },
      {
        "Name": "LA MEDINA",
        "NameAr": "ØªÙˆÙ†Ø³ Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©",
        "Value": "LA MEDINA",
        "PostalCode": "1000",
        "Latitude": 36.800000,
        "Longitude": 10.171667
      },
      {
        "Name": "EL MENZAH",
        "NameAr": "Ø§Ù„Ù…Ù†Ø²Ù‡",
        "Value": "EL MENZAH",
        "PostalCode": "2092",
        "Latitude": 36.845194,
        "Longitude": 10.176694
      },
      {
        "Name": "EL OMRANE SUPERIEUR",
        "NameAr": "Ø§Ù„Ø¹Ù…Ø±Ø§Ù† Ø§Ù„Ø£Ø¹Ù„Ù‰",
        "Value": "EL OMRANE SUPERIEUR",
        "PostalCode": "1064",
        "Latitude": 36.822500,
        "Longitude": 10.162222
      },
      {
        "Name": "CITE EL KHADRA",
        "NameAr": "Ø­ÙŠ Ø§Ù„Ø®Ø¶Ø±Ø§Ø¡",
        "Value": "CITE EL KHADRA",
        "PostalCode": "1002",
        "Latitude": 36.834300,
        "Longitude": 10.199000
      },
      {
        "Name": "EL HRAIRIA",
        "NameAr": "Ø§Ù„Ø­Ø±Ø§ÙŠØ±ÙŠØ©",
        "Value": "EL HRAIRIA",
        "PostalCode": "2051",
        "Latitude": 36.775278,
        "Longitude": 10.102778
      },
      {
        "Name": "EL KABBARIA",
        "NameAr": "Ø§Ù„ÙƒØ¨Ø§Ø±ÙŠØ©",
        "Value": "EL KABBARIA",
        "PostalCode": "1074",
        "Latitude": 36.766667,
        "Longitude": 10.175000
      },
      {
        "Name": "BAB SOUIKA",
        "NameAr": "Ø¨Ø§Ø¨ Ø³ÙˆÙŠÙ‚Ø©",
        "Value": "BAB SOUIKA",
        "PostalCode": "1075",
        "Latitude": 36.807500,
        "Longitude": 10.166944
      },
      {
        "Name": "EL OMRANE",
        "NameAr": "Ø§Ù„Ø¹Ù…Ø±Ø§Ù†",
        "Value": "EL OMRANE",
        "PostalCode": "1005",
        "Latitude": 36.820000,
        "Longitude": 10.155000
      },
      {
        "Name": "EZZOUHOUR  (TUNIS)",
        "NameAr": "Ø§Ù„Ø²Ù‡ÙˆØ± (ØªÙˆÙ†Ø³)",
        "Value": "EZZOUHOUR  (TUNIS)",
        "PostalCode": "2052",
        "Latitude": 36.788500,
        "Longitude": 10.129000
      },
      {
        "Name": "SIDI EL BECHIR",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ø§Ù„Ø¨Ø´ÙŠØ±",
        "Value": "SIDI EL BECHIR",
        "PostalCode": "1089",
        "Latitude": 36.783333,
        "Longitude": 10.190000
      },
      {
        "Name": "SIDI HASSINE",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ø­Ø³ÙŠÙ†",
        "Value": "SIDI HASSINE",
        "PostalCode": "1095",
        "Latitude": 36.794444,
        "Longitude": 10.083333
      },
      {
        "Name": "EL KRAM",
        "NameAr": "Ø§Ù„ÙƒØ±Ù…",
        "Value": "EL KRAM",
        "PostalCode": "2089",
        "Latitude": 36.833333,
        "Longitude": 10.316667
      },
      {
        "Name": "ESSIJOUMI",
        "NameAr": "Ø§Ù„Ø³ÙŠØ¬ÙˆÙ…ÙŠ",
        "Value": "ESSIJOUMI",
        "PostalCode": "2072",
        "Latitude": 36.783333,
        "Longitude": 10.133333
      },
      {
        "Name": "ETTAHRIR",
        "NameAr": "Ø§Ù„ØªØ­Ø±ÙŠØ±",
        "Value": "ETTAHRIR",
        "PostalCode": "2042",
        "Latitude": 36.826111,
        "Longitude": 10.142778
      },
      {
        "Name": "EL OUERDIA",
        "NameAr": "Ø§Ù„ÙˆØ±Ø¯ÙŠØ©",
        "Value": "EL OUERDIA",
        "PostalCode": "1009",
        "Latitude": 36.772500,
        "Longitude": 10.185000
      }
    ]
  },
  {
    "Name": "ZAGHOUAN",
    "NameAr": "Ø²ØºÙˆØ§Ù†",
    "Value": "ZAGHOUAN",
    "Delegations": [
      {
        "Name": "ZAGHOUAN",
        "NameAr": "Ø²ØºÙˆØ§Ù†",
        "Value": "ZAGHOUAN",
        "PostalCode": "1100",
        "Latitude": 36.400000,
        "Longitude": 10.150000
      },
      {
        "Name": "ENNADHOUR",
        "NameAr": "Ø§Ù„Ù†Ø§Ø¸ÙˆØ±",
        "Value": "ENNADHOUR",
        "PostalCode": "1160",
        "Latitude": 36.216667,
        "Longitude": 10.066667
      },
      {
        "Name": "EL FAHS",
        "NameAr": "Ø§Ù„ÙØ­Øµ",
        "Value": "EL FAHS",
        "PostalCode": "1140",
        "Latitude": 36.376111,
        "Longitude": 9.904167
      },
      {
        "Name": "BIR MCHERGA",
        "NameAr": "Ø¨Ø¦Ø± Ù…Ø´Ø§Ø±Ù‚Ø©",
        "Value": "BIR MCHERGA",
        "PostalCode": "1111",
        "Latitude": 36.516667,
        "Longitude": 10.016667
      },
      {
        "Name": "HAMMAM ZRIBA",
        "NameAr": "Ø­Ù…Ø§Ù… Ø§Ù„Ø²Ø±ÙŠØ¨Ø©",
        "Value": "HAMMAM ZRIBA",
        "PostalCode": "1112",
        "Latitude": 36.300000,
        "Longitude": 10.216667
      },
      {
        "Name": "SAOUEF",
        "NameAr": "ØµÙˆØ§Ù",
        "Value": "SAOUEF",
        "PostalCode": "1115",
        "Latitude": 36.266667,
        "Longitude": 9.816667
      }
    ]
  }
]$$::jsonb AS j
),
gov_map AS (
  SELECT id, upper(trim(name)) AS gov_name_norm
  FROM governorates
),
flat AS (
  SELECT
    upper(trim(gov->>'Name')) AS gov_name_norm,
    trim(del->>'Name') AS place_name,
    lpad(regexp_replace(trim(del->>'PostalCode'), '\D', '', 'g'), 4, '0') AS code
  FROM raw
  CROSS JOIN LATERAL jsonb_array_elements(j) AS gov
  CROSS JOIN LATERAL jsonb_array_elements(gov->'Delegations') AS del
  WHERE coalesce(trim(del->>'PostalCode'),'') <> ''
    AND coalesce(trim(del->>'Name'),'') <> ''
),
dedup AS (
  SELECT DISTINCT ON (code)
    gov_name_norm,
    place_name,
    code
  FROM flat
  WHERE code ~ '^[0-9]{4}$'
  ORDER BY code, gov_name_norm, place_name
)
INSERT INTO postal_codes (governorate_id, code, place_name)
SELECT
  gm.id,
  d.code::char(4),
  d.place_name
FROM dedup d
JOIN gov_map gm ON gm.gov_name_norm = d.gov_name_norm
ON CONFLICT (code) DO UPDATE
SET governorate_id = EXCLUDED.governorate_id,
    place_name     = EXCLUDED.place_name;
