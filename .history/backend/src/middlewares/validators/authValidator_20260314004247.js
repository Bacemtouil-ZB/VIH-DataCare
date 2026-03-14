// src/middleware/validators/authValidator.js
import { body, validationResult } from "express-validator";
import { handleValidation } from "./handleValidation.js";
// mots de passe trop courants
const PASSWORD_BLACKLIST = [
  "12345678",
  "password",
  "password1",
  "azerty123",
  "qwerty123",
  "00000000",
  "11111111",
  "motdepasse",
];

// ── Register ─────────────────────────────────────────────
export const validateRegister = [
  body("nom")
    .trim()
    .notEmpty()
    .withMessage("Nom est requis")
    .isLength({ min: 2, max: 50 })
    .withMessage("Nom : 2 à 50 caractères")
    .matches(/^[a-zA-ZÀ-ÿ\s\-']+$/)
    .withMessage("Nom : lettres uniquement"),

  body("prenom")
    .trim()
    .notEmpty()
    .withMessage("Prénom est requis")
    .isLength({ min: 2, max: 50 })
    .withMessage("Prénom : 2 à 50 caractères")
    .matches(/^[a-zA-ZÀ-ÿ\s\-']+$/)
    .withMessage("Prénom : lettres uniquement"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email est requis")
    .isEmail()
    .withMessage("Format email invalide")
    .isLength({ max: 255 })
    .withMessage("Email trop long")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Mot de passe est requis")
    .isLength({ min: 8 })
    .withMessage("Minimum 8 caractères")
    .isLength({ max: 72 })
    .withMessage("Maximum 72 caractères")
    .matches(/[A-Z]/)
    .withMessage("Au moins une majuscule")
    .matches(/[0-9]/)
    .withMessage("Au moins un chiffre")
    .custom((value) => {
      if (PASSWORD_BLACKLIST.includes(value.toLowerCase())) {
        throw new Error("Mot de passe trop courant, choisissez-en un autre");
      }
      return true;
    }),

  handleValidation,
];

// ── Login ─────────────────────────────────────────────────
export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email est requis")
    .isEmail()
    .withMessage("Format email invalide")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Mot de passe est requis")
    .isLength({ max: 72 })
    .withMessage("Mot de passe invalide"),

  body("rememberMe")
    .optional()
    .isBoolean()
    .withMessage("Valeur booléenne requise")
    .toBoolean(),

  handleValidation,
];

// ── Forgot password ───────────────────────────────────────
export const validateForgotPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email est requis")
    .isEmail()
    .withMessage("Format email invalide")
    .normalizeEmail(),

  handleValidation,
];

// ── Reset password ────────────────────────────────────────
export const validateResetPassword = [
  body("token")
    .notEmpty()
    .withMessage("Token est requis")
    .isString()
    .withMessage("Token invalide"),

  body("password")
    .notEmpty()
    .withMessage("Mot de passe est requis")
    .isLength({ min: 8 })
    .withMessage("Minimum 8 caractères")
    .isLength({ max: 72 })
    .withMessage("Maximum 72 caractères")
    .matches(/[A-Z]/)
    .withMessage("Au moins une majuscule")
    .matches(/[0-9]/)
    .withMessage("Au moins un chiffre")
    .custom((value) => {
      if (PASSWORD_BLACKLIST.includes(value.toLowerCase())) {
        throw new Error("Mot de passe trop courant, choisissez-en un autre");
      }
      return true;
    }),

  handleValidation,
];
