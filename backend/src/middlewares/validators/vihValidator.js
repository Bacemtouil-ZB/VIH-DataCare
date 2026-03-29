import { body } from "express-validator";
import { handleValidation } from "./handleValidation.js";

const TYPES_DEPISTAGE = ["Trod", "Elisa", "Autres"];

const CIRCONSTANCES_DECOUVERTE = [
  "Proposition d'une association",
  "Proposition à l'initiative du patient",
  "Proposition du médecin",
  "Demande du patient",
  "Autres circonstances",
];



const TYPAGE_HLA_OPTIONS = ["Positif", "Négatif"];

const validateDatePast = (value, fieldName) => {
  if (!value) return true;

  if (/^\d{10,13}$/.test(value)) {
    throw new Error(`${fieldName} : utilisez le format YYYY-MM-DD`);
  }

  const date = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date > today) {
    throw new Error(`${fieldName} ne peut pas être dans le futur`);
  }

  if (date.getFullYear() < 1900) {
    throw new Error(`${fieldName} semble incorrecte`);
  }

  const [year, month, day] = value.split("-").map(Number);
  const check = new Date(year, month - 1, day);
  if (check.getMonth() !== month - 1) {
    throw new Error(`${fieldName} invalide (ex: 31 février n'existe pas)`);
  }

  return true;
};

const validateTypeDepistage = body("type_depistage")
  .trim()
  .notEmpty()
  .withMessage("Le type de dépistage est requis")
  .isIn(TYPES_DEPISTAGE)
  .withMessage("Type de dépistage invalide")
  .isLength({ max: 20 })
  .withMessage("Type de dépistage trop long");

const validateCirconstanceDecouverte = body("circonstance_decouverte")
  .trim()
  .notEmpty()
  .withMessage("La circonstance de découverte est requise")
  .isIn(CIRCONSTANCES_DECOUVERTE)
  .withMessage("Circonstance de découverte invalide")
  .isLength({ max: 100 })
  .withMessage("Circonstance de découverte trop longue");

const validateDateDerniereNegative = body("date_derniere_negative")
  .optional({ nullable: true, checkFalsy: true })
  .isDate({ format: "YYYY-MM-DD", strictMode: true })
  .withMessage("Format invalide (attendu: YYYY-MM-DD)")
  .custom((value) =>
    validateDatePast(value, "La date du dernier test négatif"),
  );



const validateDateVihPositif = body("date_vih_positif")
  .trim()
  .notEmpty()
  .withMessage("La date du test VIH positif est obligatoire")
  .isDate({ format: "YYYY-MM-DD", strictMode: true })
  .withMessage("Format invalide (attendu: YYYY-MM-DD)")
  .custom((value) => validateDatePast(value, "La date du test VIH positif"));


const validateTypageHla = body("typage_hla_b5701")
  .trim()
  .notEmpty()
  .withMessage("Le typage HLA-B5701 est requis")
  .isIn(TYPAGE_HLA_OPTIONS)
  .withMessage("Valeur HLA-B5701 invalide : Positif ou Négatif");

export const validateDateLogic = (req, res, next) => {
  const { date_derniere_negative,  date_vih_positif } =
    req.body;

  const datePositif = date_vih_positif ? new Date(date_vih_positif) : null;
  const dateNeg = date_derniere_negative ?
      new Date(date_derniere_negative)
    : null;

  if (dateNeg && datePositif && dateNeg >= datePositif) {
    return res.status(400).json({
      success: false,
      message:
        "La date du dernier test négatif doit être antérieure à la date VIH positif",
    });
  }



  next();
};

export const validateCreateVih = [
  validateTypeDepistage,
  validateCirconstanceDecouverte,
  validateDateDerniereNegative,
  validateDateVihPositif,
  validateTypageHla,
  handleValidation,
];

export const validateUpdateVih = [
  validateTypeDepistage,
  validateCirconstanceDecouverte,
  validateDateDerniereNegative,
  validateDateVihPositif,
  validateTypageHla,
  handleValidation,
];
