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