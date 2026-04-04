import { body, param } from "express-validator";
import { handleValidation } from "./handleValidation.js";

const NUMERIC_LIMITS = {
  asat: { min: 0, max: 10000, label: "ASAT (UI/L)" },
  alat: { min: 0, max: 10000, label: "ALAT (UI/L)" },
  phosphore: { min: 0, max: 10, label: "Phosphore (mmol/L)" },
  calcemie: { min: 0, max: 5, label: "Calcemie (mmol/L)" },
  creatinine: { min: 0, max: 3000, label: "Creatinine" },

  hemoglobine: { min: 0, max: 30, label: "Hemoglobine (g/dL)" },
  plaquettes: { min: 0, max: 3000, label: "Plaquettes (10^3/mm^3)" },
  globules_blancs: { min: 0, max: 300, label: "Globules blancs (10^3/mm^3)" },
  lymphocytes: { min: 0, max: 100, label: "Lymphocytes (10^3/mm^3)" },

  charge_virale_valeur: { min: 0, max: 1000000000, label: "Charge virale (copies/mL)" },
  cd4_absolu: { min: 0, max: 5000, label: "CD4 absolu (cellules/mm^3)" },
  cd4_pourcent: { min: 0, max: 100, label: "CD4 pourcent (%)" },

  cholesterol_total: { min: 0, max: 20, label: "Cholesterol total (mmol/L)" },
  hdl: { min: 0, max: 10, label: "HDL (mmol/L)" },
  ldl: { min: 0, max: 20, label: "LDL (mmol/L)" },
  triglycerides: { min: 0, max: 50, label: "Triglycerides (mmol/L)" },
};

const SELECT_LIMITS = {
  serologie_vih: ["positif", "negatif", "NF"],
  vhb_ag_hbs: ["positif", "negatif", "NF"],
  vhb_ac_hbs: ["positif", "negatif", "NF"],
  vhb_ac_hbc: ["positif", "negatif", "NF"],
  vha_igg: ["positif", "negatif", "NF"],
  vhc: ["positif", "negatif", "NF"],
  vdrl: ["positif", "negatif", "NF"],
  tpha: ["positif", "negatif", "NF"],
  toxo_igm: ["positif", "negatif", "NF"],
  toxo_igg: ["positif", "negatif", "NF"],
  cmv_igm: ["positif", "negatif", "NF"],
  cmv_igg: ["positif", "negatif", "NF"],
  leishmania_ac: ["positif", "negatif", "NF"],
  idr_tuberculine: ["negatif", "positif" ,"NF"],
  radio_resultat: ["negatif", "positif" ,"NF"],
};

const DATE_FIELDS = [
  "date_resultat",
  "date_serologie_vih",
  "date_bilan_biochimique",
  "date_serologie_vhb",
  "date_nfs_complete",
  "date_charge_virale_vih",
  "date_cd4_cd8",
  "date_bilan_lipidique",
  "date_serologie_vha",
  "date_serologie_vhc",
  "date_serologie_syphilis",
  "date_serologie_toxoplasmose",
  "date_serologie_cmv",
  "date_serologie_leishmaniose",
  "date_idr_tuberculine",
  "date_test_genotypage",
  "date_radio_thorax",
];

const TEXT_FIELDS = {
  observations: { max: 4000, label: "Observations" },
  radio_description: { max: 4000, label: "Description radio" },
  // Taille maximale du champ genotypage_file_url : 50MB environ en base64
  genotypage_file_url: { max: 50000000, label: "Fichier genotypage" },
};

const RESULT_VALUE_FIELDS = [
  ...Object.keys(NUMERIC_LIMITS),
  ...Object.keys(SELECT_LIMITS),
  "radio_description",
  "genotypage_file_url",
];

const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const sanitizeBody = (req, _res, next) => {
  for (const [key, value] of Object.entries(req.body || {})) {
    if (typeof value === "string") {
      const cleaned = value.trim();
      req.body[key] = cleaned === "" ? null : cleaned;
    }
  }
  next();
};

const validatePastOrTodayDate = (value, fieldLabel) => {
  if (value === null || value === undefined) return true;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${fieldLabel}: date invalide`);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  parsed.setHours(0, 0, 0, 0);

  if (parsed > today) {
    throw new Error(`${fieldLabel} ne peut pas etre dans le futur`);
  }

  if (parsed.getFullYear() < 1900) {
    throw new Error(`${fieldLabel} semble incorrecte`);
  }

  return true;
};


const validateDates = DATE_FIELDS.map((field) =>
  body(field)
    .if((value, { req }) => Object.prototype.hasOwnProperty.call(req.body || {}, field))
    .notEmpty()
    .withMessage(`${field} est obligatoire`)
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage(`${field} doit respecter le format YYYY-MM-DD`)
    .custom((value) => validatePastOrTodayDate(value, field)),
);

const validateTexts = Object.entries(TEXT_FIELDS).map(([field, meta]) =>
  body(field)
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage(`${meta.label} doit etre un texte`)
    .isLength({ max: meta.max })
    .withMessage(`${meta.label} ne doit pas depasser ${meta.max} caracteres`),
);

const validateGenotypageFile = body("genotypage_file_url")
  .optional({ nullable: true, checkFalsy: true })
  .custom((value) => {
    if (!value) return true;

    const textValue = String(value).trim();

    const isDataUri = (uri) => {
      if (!uri || typeof uri !== "string") return false;
      const normalized = uri.toLowerCase();
      return normalized.startsWith("data:image/") || normalized.startsWith("data:application/pdf");
    };

    const isHttpUrl = (uri) => {
      if (!uri || typeof uri !== "string") return false;
      const normalized = uri.toLowerCase();
      return normalized.startsWith("http://") || normalized.startsWith("https://");
    };

    const validateSingleValue = (v) => {
      if (!v || typeof v !== "string") return false;
      const trimmed = v.trim();
      return isDataUri(trimmed) || isHttpUrl(trimmed);
    };

    // Si c'est un tableau JSON (plusieurs fichiers)
    if (textValue.startsWith("[") && textValue.endsWith("]")) {
      let parsed;
      try {
        parsed = JSON.parse(textValue);
      } catch {
        throw new Error("Le fichier genotypage doit etre un tableau JSON de dataURL ou d'URLs valide");
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("Le fichier genotypage doit contenir au moins un fichier");
      }

      parsed.forEach((entry) => {
        if (!validateSingleValue(entry)) {
          throw new Error("Chaque élément de genotypage_file_url doit etre une image, un PDF ou une URL valide");
        }
      });

      // vérification de la taille
      const MAX_GENOTYPAGE_LENGTH = 50000000; // 50MB de texte
      if (textValue.length > MAX_GENOTYPAGE_LENGTH) {
        throw new Error("Le fichier genotypage est trop volumineux (max 50MB). Utilisez moins de fichiers ou des fichiers plus petits.");
      }

      return true;
    }

    // Cas simple fichier unique
    if (!validateSingleValue(textValue)) {
      throw new Error("Le fichier genotypage doit etre une image, un PDF ou une URL valide");
    }

    const MAX_GENOTYPAGE_LENGTH = 50000000; // 50MB de texte
    if (textValue.length > MAX_GENOTYPAGE_LENGTH) {
      throw new Error("Le fichier genotypage est trop volumineux (max 50MB). Utilisez moins de fichiers ou des fichiers plus petits.");
    }

    return true;
  });

const validateNumerics = Object.entries(NUMERIC_LIMITS).map(([field, meta]) =>
  body(field)
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: meta.min, max: meta.max })
    .withMessage(`${meta.label} doit etre entre ${meta.min} et ${meta.max}`)
    .toFloat(),
);

const validateSelects = Object.entries(SELECT_LIMITS).map(([field, allowedValues]) =>
  body(field)
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage(`${field} doit etre une valeur texte`)
    .custom((value) => {
      const normalizedValue = normalize(value);
      const normalizedAllowed = allowedValues.map(normalize);

      if (!normalizedAllowed.includes(normalizedValue)) {
        throw new Error(`${field} contient une valeur non valide`);
      }

      return true;
    }),
);


export const validateCreateResultatBiologique = [
  sanitizeBody,

  ...validateDates,
  ...validateTexts,
  validateGenotypageFile,
  ...validateNumerics,
  ...validateSelects,
  handleValidation,
];

export const validateUpdateResultatBiologique = [
  sanitizeBody,

  ...validateDates,
  ...validateTexts,
  validateGenotypageFile,
  ...validateNumerics,
  ...validateSelects,

  handleValidation,
];
