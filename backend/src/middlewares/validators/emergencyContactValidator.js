import { body } from "express-validator";
import { handleValidation } from "./handleValidation.js";

// ─── Helpers partagés ─────────────────────────────────────────────────────────

const FORBIDDEN_PATTERNS =
  /<[^>]*>|javascript:|on\w+=|script|SELECT\s+|INSERT\s+|DROP\s+|UPDATE\s+|DELETE\s+|UNION\s+|--|\$\{|\{\{/i;

const containsMalicious = (value) => {
  if (FORBIDDEN_PATTERNS.test(value)) throw new Error("Entrée invalide détectée");
  return true;
};

// ─── Champs ───────────────────────────────────────────────────────────────────

const validateNom = body("nom")
  .trim()
  .notEmpty()
  .withMessage("Le nom est obligatoire")
  .isLength({ min: 2 })
  .withMessage("Le nom doit contenir au moins 2 caractères")
  .isLength({ max: 200 })
  .withMessage("Le nom ne peut pas dépasser 200 caractères")
  .custom((value) => {
    if (/\u0000|%00/.test(value)) throw new Error("Caractère interdit détecté");
    containsMalicious(value);
    return true;
  });

const validateTelephone = body("telephone")
 .trim()
  .notEmpty()
  .withMessage("Le numéro de téléphone est obligatoire")
  .matches(/^\+?[\d\s\-().]{6,20}$/)
  .withMessage("Numéro de téléphone invalide (ex: +216 XX XXX XXX)")
  .custom((value) => {
    if (!value) return true;
    containsMalicious(value);
    return true;
  });

const validateWhatsapp = body("whatsapp")
  .optional({ nullable: true, checkFalsy: true })
  .trim()
  .matches(/^\+?[\d\s\-().]{6,20}$/)
  .withMessage("Numéro WhatsApp invalide (ex: +216 XX XXX XXX)")
  .custom((value) => {
    if (!value) return true;
    containsMalicious(value);
    return true;
  });

const validateEmail = body("email")
  .optional({ nullable: true, checkFalsy: true })
  .trim()
  .isEmail()
  .withMessage("Adresse email invalide")
  .isLength({ max: 254 })
  .withMessage("Email trop long (max 254 caractères)")
  .custom((value) => {
    if (!value) return true;
    containsMalicious(value);
    return true;
  });

const validateDescription = body("description")
  .optional({ nullable: true, checkFalsy: true })
  .trim()
  .isLength({ max: 500 })
  .withMessage("Description trop longue (max 500 caractères)")
  .custom((value) => {
    if (!value) return true;
    if (/\u0000|%00/.test(value)) throw new Error("Caractère interdit détecté");
    containsMalicious(value);
    return true;
  });

// ─── Exports ──────────────────────────────────────────────────────────────────

export const validateCreateEmergencyContact = [
  validateNom,
  validateTelephone,
  validateWhatsapp,
  validateEmail,
  validateDescription,
  handleValidation,
];

export const validateUpdateEmergencyContact = [
  validateNom,
  validateTelephone,
  validateWhatsapp,
  validateEmail,
  validateDescription,
  handleValidation,
];
