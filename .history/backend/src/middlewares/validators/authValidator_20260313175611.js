import { body, validationResult } from "express-validator";

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email requis")
    .isEmail()
    .withMessage("Email invalide")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Mot de passe requis"),
  handleValidation,
];

export const validateRegister = [
  body("nom")
    .trim()
    .notEmpty()
    .withMessage("Nom requis")
    .isLength({ min: 2, max: 50 })
    .withMessage("Nom : 2 à 50 caractères"),
  body("prenom")
    .trim()
    .notEmpty()
    .withMessage("Prénom requis")
    .isLength({ min: 2, max: 50 })
    .withMessage("Prénom : 2 à 50 caractères"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email requis")
    .isEmail()
    .withMessage("Email invalide")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Mot de passe requis")
    .isLength({ min: 8 })
    .withMessage("Minimum 8 caractères"),
  body("role")
    .optional()
    .isIn(["admin", "pharmacien", "medecin", "analyste"])
    .withMessage("Rôle invalide"),
  handleValidation,
];
