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
  serologie_vih: ["positif", "negatif"],
  vhb_ag_hbs: ["positif", "negatif"],
  vhb_ac_hbs: ["positif", "negatif"],
  vhb_ac_hbc: ["positif", "negatif"],
  vha_igg: ["positif", "negatif"],
  vhc: ["positif", "negatif"],
  vdrl: ["positif", "negatif"],
  tpha: ["positif", "negatif"],
  toxo_igm: ["positif", "negatif"],
  toxo_igg: ["positif", "negatif"],
  cmv_igm: ["positif", "negatif"],
  cmv_igg: ["positif", "negatif"],
  leishmania_ac: ["positif", "negatif"],
  idr_tuberculine: ["negatif", "positif"],
  radio_resultat: ["negatif", "positif"],
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
  genotypage_file_url: { max: 5000000, label: "Fichier genotypage" },
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
    const normalized = String(value || "").trim().toLowerCase();
    const isDataImage = normalized.startsWith("data:image/");
    const isDataPdf = normalized.startsWith("data:application/pdf");
    const isHttpUrl = normalized.startsWith("http://") || normalized.startsWith("https://");

    if (!isDataImage && !isDataPdf && !isHttpUrl) {
      throw new Error("Le fichier genotypage doit etre une image, un PDF ou une URL valide");
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
