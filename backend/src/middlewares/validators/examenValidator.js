import { body } from "express-validator";
import { handleValidation } from "./handleValidation.js";

// ─── Helpers partagés ─────────────────────────────────────────────────────────

const FORBIDDEN_PATTERNS =
  /<[^>]*>|javascript:|on\w+=|script|SELECT\s+|INSERT\s+|DROP\s+|UPDATE\s+|DELETE\s+|UNION\s+|--|\$\{|\{\{/i;

const containsMalicious = (value) => {
  if (FORBIDDEN_PATTERNS.test(value)) throw new Error("Entrée invalide détectée");
  return true;
};

// ─── Champ partagé : autres_signes (SC et SF) ────────────────────────────────

const validateAutresSignes = body("autres_signes")
  .optional({ nullable: true })
  .isArray()
  .withMessage("autres_signes doit être un tableau");

const validateAutresSignesDescription = body("autres_signes.*.description")
  .optional({ nullable: true })

  .trim()
  .isLength({ max: 500 })
  .withMessage("Description trop longue (max 500 caractères)")
  .custom((value) => {
    if (!value) return true;
    if (/\u0000|%00/.test(value)) throw new Error("Caractère interdit détecté");
    containsMalicious(value);
    return true;
  });

// ─── OBSERVATION ─────────────────────────────────────────────────────────────

const validateRemarque = body("remarque")
  .trim()
  .notEmpty()
  .withMessage("La remarque est requise")
  .isLength({ min: 5 })
  .withMessage("La remarque doit contenir au moins 5 caractères")
  .isLength({ max: 5000 })
  .withMessage("La remarque ne peut pas dépasser 5000 caractères")
  .custom((value) => {
    if (/^\s+$/.test(value)) {
      throw new Error("La remarque ne peut pas contenir uniquement des espaces");
    }
    if (/\u0000|%00/.test(value)) throw new Error("Caractère interdit détecté");
    containsMalicious(value);
    return true;
  });

export const validateCreateObservation = [
  validateRemarque,
  handleValidation,
];

export const validateUpdateObservation = [
  validateRemarque,
  handleValidation,
];

// ─── SIGNES CLINIQUES ─────────────────────────────────────────────────────────

const validateTaille = body("taille")
  .optional({ nullable: true })          // ← null ET undefined sautent le validator
  .custom((value) => {
    if (value === "" || value === undefined) return true;

    const num = Number(value);
    if (isNaN(num)) throw new Error("La taille doit être un nombre");
    if (num < 10 || num > 250) throw new Error("Taille invalide (10-250 cm)");
    return true;
  });

const validatePoids = body("poids")
  .optional({ nullable: true })         
  .custom((value) => {
    if (value === "" || value === undefined) return true;

    const num = Number(value);
    if (isNaN(num)) throw new Error("Le poids doit être un nombre");
    if (num < 1 || num > 300) throw new Error("Poids invalide (1-300 kg)");
    return true;
  });

export const validateCreateSignesCliniques = [
  validateTaille,
  validatePoids,
  validateAutresSignes,
  validateAutresSignesDescription,
  handleValidation,
];

export const validateUpdateSignesCliniques = [
  validateTaille,
  validatePoids,
  validateAutresSignes,
  validateAutresSignesDescription,
  handleValidation,
];

// ─── SIGNES FONCTIONNELS ──────────────────────────────────────────────────────

const SIGNES_FONCTIONNELS_KEYS = [
  "fievre", "toux", "dyspnee", "sueurs_nocturnes", "cephalee", "rhinorrhee",
  "troubles_visuels", "diarrhee", "douleurs_abdomen", "anorexie", "nausees",
  "insomnie", "dysphagie", "prurit", "paresthesie", "myalgie", "arthralgie",
  "crampes", "troubles_humeur", "troubles_libido", "asthenie",
];

const validateSignes = body("signes")
  .optional({ nullable: true })
  .custom((value) => {
    if (!value) return true;
    if (typeof value !== "object" || Array.isArray(value)) {
      throw new Error("signes doit être un objet");
    }
    for (const key of Object.keys(value)) {
      if (key !== "ras" && !SIGNES_FONCTIONNELS_KEYS.includes(key)) {
        throw new Error(`Clé inconnue dans signes : ${key}`);
      }
      if (typeof value[key] !== "boolean") {
        throw new Error(`La valeur de "${key}" doit être un booléen`);
      }
    }
    return true;
  });

const validateRas = body("signes.ras")
  .optional({ nullable: true })
  .isBoolean()
  .withMessage("ras doit être un booléen");

export const validateCreateSignesFonctionnels = [
  validateSignes,
  validateRas,
  validateAutresSignes,
  validateAutresSignesDescription,
  handleValidation,
];

export const validateUpdateSignesFonctionnels = [
  validateSignes,
  validateRas,
  validateAutresSignes,
  validateAutresSignesDescription,
  handleValidation,
];