import { body, validationResult } from "express-validator";

// Middleware pour vérifier les erreurs de validation
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Validation personnalisée pour la date de naissance
const validateBirthdate = (value) => {
  const birthDate = new Date(value);
  const today = new Date();

  if (birthDate > today) {
    throw new Error("La date de naissance ne peut pas être dans le futur");
  }

  const age = today.getFullYear() - birthDate.getFullYear();
  if (age > 150) {
    throw new Error("La date de naissance semble incorrecte (âge > 150 ans)");
  }

  return true;
};

// Validation personnalisée pour le numéro de téléphone
const validatePhone = (value) => {
  if (!value) return true;
  
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(value)) {
    throw new Error("Le numéro de téléphone contient des caractères invalides");
  }
  
  return true;
};

// Middleware pour valider la création d'un patient
export const validateCreatePatient = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Le prénom est requis")
    .isLength({ min: 2, max: 100 })
    .withMessage("Le prénom doit contenir entre 2 et 100 caractères"),

  body("surname")
    .trim()
    .notEmpty()
    .withMessage("Le nom de famille est requis")
    .isLength({ min: 2, max: 100 })
    .withMessage("Le nom de famille doit contenir entre 2 et 100 caractères"),

  body("birthdate")
    .notEmpty()
    .withMessage("La date de naissance est requise")
    .isDate()
    .withMessage("La date de naissance doit être une date valide (YYYY-MM-DD)")
    .custom(validateBirthdate),

  body("gender")
    .trim()
    .notEmpty()
    .withMessage("Le genre est requis"),

  body("city_of_birth")
    .trim()
    .notEmpty()
    .withMessage("La ville de naissance est requise"),

  body("city_of_residence")
    .trim()
    .notEmpty()
    .withMessage("La ville de résidence est requise"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Le numéro de téléphone est requis")
    .custom(validatePhone),

  body("address")
    .optional()
    .trim(),

  body("hospitalisation")
    .trim()
    .notEmpty()
    .withMessage("Le type d'hospitalisation est requis")
    .isIn(["interne", "externe"])
    .withMessage("L'hospitalisation doit être 'interne' ou 'externe'"),

  handleValidationErrors,
];

// Middleware pour valider les filtres de getAllPatients
export const validateGetAllPatientsFilters = [

  handleValidationErrors,
];