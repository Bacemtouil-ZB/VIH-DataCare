import { body } from "express-validator";
import { handleValidation } from "./handleValidation.js";

// ─── Helpers partagés ─────────────────────────────────────────────────────────

const FORBIDDEN_PATTERNS =
  /<[^>]*>|javascript:|on\w+=|script|SELECT\s+|INSERT\s+|DROP\s+|UPDATE\s+|DELETE\s+|UNION\s+|--|\$\{|\{\{/i;

const containsMalicious = (value) => {
  if (FORBIDDEN_PATTERNS.test(value)) throw new Error("Entrée invalide détectée");
  return true;
};
const TUNISIAN_PHONE_REGEX = /^(\+216)?[24579]\d{7}$/;
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
  .notEmpty()
  .withMessage("Le numéro de téléphone est obligatoire")
  .trim()
  .custom((value) => {
    if (!value) return true;

    // Caractères invalides
    if (/[a-zA-Z]/.test(value))
      throw new Error("Le téléphone ne peut pas contenir de lettres");

    // Caractères spéciaux non autorisés
    if (/[^\d\s\-\+\(\)]/.test(value))
      throw new Error("Caractères invalides dans le numéro");

    // Format tunisien strict
    const cleaned = value.replace(/[\s\-\(\)]/g, "");
    if (!TUNISIAN_PHONE_REGEX.test(cleaned))
      throw new Error(
        "Numéro tunisien invalide (ex: 20123456 — commence par 2,4,5,7 ou 9)",
      );

    // Numéro fictif / tous zéros
    if (/^0+$/.test(cleaned))
      throw new Error("Numéro de téléphone invalide");

    // Séquence répétitive (11111111)
    if (/^(.)\1{7}$/.test(cleaned))
      throw new Error("Numéro de téléphone invalide");

    // Longueur exacte
    if (cleaned.length !== 8)
      throw new Error("Le numéro tunisien doit contenir exactement 8 chiffres");

    // Injection
    containsMalicious(value);

    return true;
  });

const validateWhatsapp = body("whatsapp")
  .notEmpty()
  .withMessage("Le numéro de WhatsApp est obligatoire")
  .trim()
  .custom((value) => {
    if (!value) return true;

    // Caractères invalides
    if (/[a-zA-Z]/.test(value))
      throw new Error("Le téléphone ne peut pas contenir de lettres");

    // Caractères spéciaux non autorisés
    if (/[^\d\s\-\+\(\)]/.test(value))
      throw new Error("Caractères invalides dans le numéro");

    // Format tunisien strict
    const cleaned = value.replace(/[\s\-\(\)]/g, "");
    if (!TUNISIAN_PHONE_REGEX.test(cleaned))
      throw new Error(
        "Numéro tunisien invalide (ex: 20123456 — commence par 2,4,5,7 ou 9)",
      );

    // Numéro fictif / tous zéros
    if (/^0+$/.test(cleaned))
      throw new Error("Numéro de WhatsApp invalide");

    // Séquence répétitive (11111111)
    if (/^(.)\1{7}$/.test(cleaned))
      throw new Error("Numéro de WhatsApp invalide");

    // Longueur exacte
    if (cleaned.length !== 8)
      throw new Error("Le numéro tunisien doit contenir exactement 8 chiffres");

    // Injection
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
