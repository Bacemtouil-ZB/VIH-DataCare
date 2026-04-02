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

const RESULT_FIELDS = [
  "serologie_vih",
  "asat",
  "alat",
  "phosphore",
  "calcemie",
  "creatinine",
  "vhb_ag_hbs",
  "vhb_ac_hbs",
  "vhb_ac_hbc",
  "hemoglobine",
  "plaquettes",
  "globules_blancs",
  "lymphocytes",
  "charge_virale_valeur",
  "cd4_absolu",
  "cd4_pourcent",
  "cholesterol_total",
  "hdl",
  "ldl",
  "triglycerides",
  "vha_igg",
  "vhc",
  "vdrl",
  "tpha",
  "toxo_igm",
  "toxo_igg",
  "cmv_igm",
  "cmv_igg",
  "leishmania_ac",
  "idr_tuberculine",
  "genotypage_file_url",
  "radio_resultat",
  "radio_description",
];

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

const DATE_BY_SECTION = [
  { dateField: "date_serologie_vih", fields: ["serologie_vih"] },
  { dateField: "date_bilan_biochimique", fields: ["asat", "alat", "phosphore", "calcemie", "creatinine"] },
  { dateField: "date_serologie_vhb", fields: ["vhb_ag_hbs", "vhb_ac_hbs", "vhb_ac_hbc"] },
  { dateField: "date_nfs_complete", fields: ["hemoglobine", "plaquettes", "globules_blancs", "lymphocytes"] },
  { dateField: "date_charge_virale_vih", fields: ["charge_virale_valeur"] },
  { dateField: "date_cd4_cd8", fields: ["cd4_absolu", "cd4_pourcent"] },
  { dateField: "date_bilan_lipidique", fields: ["cholesterol_total", "hdl", "ldl", "triglycerides"] },
  { dateField: "date_serologie_vha", fields: ["vha_igg"] },
  { dateField: "date_serologie_vhc", fields: ["vhc"] },
  { dateField: "date_serologie_syphilis", fields: ["vdrl", "tpha"] },
  { dateField: "date_serologie_toxoplasmose", fields: ["toxo_igm", "toxo_igg"] },
  { dateField: "date_serologie_cmv", fields: ["cmv_igm", "cmv_igg"] },
  { dateField: "date_serologie_leishmaniose", fields: ["leishmania_ac"] },
  { dateField: "date_idr_tuberculine", fields: ["idr_tuberculine"] },
  { dateField: "date_test_genotypage", fields: ["genotypage_file_url"] },
  { dateField: "date_radio_thorax", fields: ["radio_resultat", "radio_description"] },
];

const hasValue = (value) => value !== null && value !== undefined && String(value).trim() !== "";

const sanitizeBody = (req, _res, next) => {
  for (const [key, value] of Object.entries(req.body || {})) {
    if (typeof value === "string") {
      const cleaned = value.trim();
      req.body[key] = cleaned === "" ? null : cleaned;
    }
  }
  next();
};

const validateDateValue = (value, fieldLabel) => {
  if (!hasValue(value)) return true;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldLabel} invalide`);
  }

  const [year, month, day] = String(value).split("-").map(Number);
  const control = new Date(year, month - 1, day);
  if (
    control.getFullYear() !== year ||
    control.getMonth() !== month - 1 ||
    control.getDate() !== day
  ) {
    throw new Error(`${fieldLabel} invalide`);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date > today) {
    throw new Error(`${fieldLabel} ne peut pas etre dans le futur`);
  }

  return true;
};

const validateNumeroDossier = body("numero_dossier")
  .trim()
  .notEmpty()
  .withMessage("Le numero de dossier est obligatoire");

const validateIdParam = param("id")
  .isInt({ min: 1 })
  .withMessage("Identifiant invalide")
  .toInt();

const validateDateResultatCreate = body("date_resultat")
  .optional({ nullable: true, checkFalsy: true })
  .isDate({ format: "YYYY-MM-DD", strictMode: true })
  .withMessage("La date du resultat doit etre au format YYYY-MM-DD")
  .custom((value) => validateDateValue(value, "La date du resultat"));

const validateDateFields = DATE_FIELDS.filter((field) => field !== "date_resultat").map((field) =>
  body(field)
    .optional({ nullable: true, checkFalsy: true })
    .isDate({ format: "YYYY-MM-DD", strictMode: true })
    .withMessage(`${field} doit etre au format YYYY-MM-DD`)
    .custom((value) => validateDateValue(value, field)),
);

const validateSectionDates = DATE_BY_SECTION.map(({ dateField, fields }) =>
  body(dateField).custom((value, { req }) => {
    const hasSectionInput = fields.some((field) => hasValue(req.body?.[field]));
    if (hasSectionInput && !hasValue(value)) {
      throw new Error(`${dateField} est obligatoire`);
    }
    return true;
  }),
);

const validateNumericBounds = Object.entries(NUMERIC_LIMITS).map(([field, meta]) =>
  body(field)
    .if((_, { req }) => Object.prototype.hasOwnProperty.call(req.body || {}, field))
    .notEmpty()
    .withMessage(`${meta.label} est obligatoire`)
    .isFloat({ min: meta.min, max: meta.max })
    .withMessage(`${meta.label} doit etre entre ${meta.min} et ${meta.max}`)
    .toFloat(),
);

const requireAtLeastOneResultField = body().custom((_, { req }) => {
  const hasOneField = RESULT_FIELDS.some((field) => hasValue(req.body?.[field]));
  if (!hasOneField) {
    throw new Error("Au moins un resultat biologique doit etre renseigne");
  }
  return true;
});

const requireAtLeastOneUpdatableField = body().custom((_, { req }) => {
  const keys = Object.keys(req.body || {});
  if (keys.length === 0) {
    throw new Error("Aucune donnee a mettre a jour");
  }
  return true;
});

export const validateCreateResultatBiologique = [
  sanitizeBody,
  validateNumeroDossier,
  validateDateResultatCreate,
  ...validateDateFields,
  ...validateNumericBounds,
  ...validateSectionDates,
  requireAtLeastOneResultField,
  handleValidation,
];

export const validateUpdateResultatBiologique = [
  sanitizeBody,
  validateIdParam,
  body("date_resultat")
    .optional({ nullable: true, checkFalsy: true })
    .isDate({ format: "YYYY-MM-DD", strictMode: true })
    .withMessage("La date du resultat doit etre au format YYYY-MM-DD")
    .custom((value) => validateDateValue(value, "La date du resultat")),
  ...validateDateFields,
  ...validateNumericBounds,
  ...validateSectionDates,
  requireAtLeastOneUpdatableField,
  requireAtLeastOneResultField,
  handleValidation,
];
