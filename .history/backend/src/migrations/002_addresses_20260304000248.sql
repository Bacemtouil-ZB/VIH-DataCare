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

source : "https://github.com/Mehdi1chouk/Tunisia_Governorates/blob/master/state-municipality.json"

//insertion de données à partir du json de codes postaux de la tunisie
WITH raw AS (
  SELECT $$PASTE_JSON_HERE$$::jsonb AS j
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