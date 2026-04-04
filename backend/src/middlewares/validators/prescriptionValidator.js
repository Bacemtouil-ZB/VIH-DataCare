import { body } from "express-validator";
import { handleValidation } from "./handleValidation.js";

// ─── Médicament ID (requis) ───────────────────────────────────────────────────

const validateMedicamentId = body("medicament_id")
  .notEmpty()
  .withMessage("Le médicament est requis")
  .custom((value) => {
    if (isNaN(value) || !Number.isInteger(Number(value))) {
      throw new Error("Identifiant médicament invalide");
    }
    if (Number(value) <= 0) {
      throw new Error("Identifiant médicament invalide");
    }
    return true;
  });

// ─── Traitement (requis) ──────────────────────────────────────────────────────

const validateTraitement = body("traitement")
  .trim()
  .notEmpty()
  .withMessage("Le traitement est requis")
  .isLength({ min: 2 })
  .withMessage("Le traitement doit contenir au moins 2 caractères")
  .isLength({ max: 255 })
  .withMessage("Le traitement ne peut pas dépasser 255 caractères")
  .custom((value) => {
    if (/^\s+$/.test(value)) {
      throw new Error(
        "Le traitement ne peut pas contenir uniquement des espaces",
      );
    }
    if (/\u0000|%00/.test(value)) throw new Error("Caractère interdit détecté");
    if (/<script|javascript:|on\w+=/i.test(value)) {
      throw new Error("Contenu invalide détecté");
    }
    return true;
  });


// ─── Posologie (optionnel) ───────────────────────────────────────────────────

const validatePosologie = body("posologie")
  .optional({ nullable: true, checkFalsy: true })
  .trim()
  .isLength({ max: 255 })
  .withMessage("La posologie ne peut pas dépasser 255 caractères")
  .custom((value) => {
    if (!value) return true;
    if (/\u0000|%00/.test(value)) throw new Error("Caractère interdit détecté");
    return true;
  });

// ─── Date (requis) ────────────────────────────────────────────────────────────

const validateDate = body("date")
  .trim()
  .notEmpty()
  .withMessage("La date de prescription est requise")
  .isDate({ format: "YYYY-MM-DD", strictMode: true })
  .withMessage("Format de date invalide (attendu: YYYY-MM-DD)")
  .custom((value) => {
    // Timestamp Unix
    if (/^\d{10,13}$/.test(value)) {
      throw new Error("Utilisez le format YYYY-MM-DD");
    }
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Date dans le futur
    if (date > today) {
      throw new Error("La date de prescription ne peut pas être dans le futur");
    }
    // Date irréaliste
    if (date.getFullYear() < 2000) {
      throw new Error("Date de prescription incorrecte");
    }
    // Date réelle
    const [year, month, day] = value.split("-").map(Number);
    const check = new Date(year, month - 1, day);
    if (check.getMonth() !== month - 1) {
      throw new Error("Date invalide (ex: 31 février n'existe pas)");
    }
    return true;
  });

// ─── Periode (requis) ────────────────────────────────────────────────────────

const validatePeriode = body("periode")
  .notEmpty()
  .withMessage("La periode est requise")
  .custom((value) => {
    // String non numérique
    if (isNaN(value)) {
      throw new Error("La periode doit être un nombre");
    }
    const num = Number(value);
    // Float
    if (!Number.isInteger(num)) {
      throw new Error("La periode doit être un entier");
    }
    // Négatif ou zéro
    if (num <= 0) {
      throw new Error("La periode doit être supérieure à 0");
    }
    // Valeur irréaliste
    if (num > 9999) {
      throw new Error("Periode trop élevée (max 9999)");
    }
    return true;
  });

// ─── Remarque (optionnel) ─────────────────────────────────────────────────────

const validateRemarque = body("remarque")
  .optional({ nullable: true, checkFalsy: true })
  .trim()
  .isLength({ max: 2000 })
  .withMessage("La remarque ne peut pas dépasser 2000 caractères")
  .custom((value) => {
    if (!value) return true;
    if (/\u0000|%00/.test(value)) throw new Error("Caractère interdit détecté");
    if (/<script|javascript:|on\w+=/i.test(value)) {
      throw new Error("Contenu invalide détecté");
    }
    return true;
  });

// ─── Exports ──────────────────────────────────────────────────────────────────

export const validateCreatePrescription = [
  validateMedicamentId,
  validateTraitement,
  validatePosologie,
  validatePosologie,
  validateDate,
  validatePeriode,
  validateRemarque,
  handleValidation,
];

export const validateUpdatePrescription = [
  validateMedicamentId,
  validateTraitement,
  validatePosologie,
  validatePosologie,
  validateDate,
  validatePeriode,
  validateRemarque,
  handleValidation,
];
