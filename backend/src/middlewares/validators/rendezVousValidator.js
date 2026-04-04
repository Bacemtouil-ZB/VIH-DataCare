import { body } from "express-validator";
import { handleValidation } from "./handleValidation.js";

// ─── Constantes ───────────────────────────────────────────────────────────────

const TYPES_RDV = ["Suivi", "Biologie", "Consultation", "Urgence"];
const STATUTS_RDV = ["Planifie", "Confirme", "Annule", "Termine"];

// ─── Date (requis) ────────────────────────────────────────────────────────────

const validateDate = body("date")
  .trim()
  .notEmpty()
  .withMessage("La date du rendez-vous est requise")
  .isDate({ format: "YYYY-MM-DD", strictMode: true })
  .withMessage("Format de date invalide (attendu: YYYY-MM-DD)")
  .custom((value) => {
    // Timestamp Unix
    if (/^\d{10,13}$/.test(value)) {
      throw new Error("Utilisez le format YYYY-MM-DD");
    }
    // Date irréaliste
    const date = new Date(value);
    if (date.getFullYear() < 2000) {
      throw new Error("Date du rendez-vous incorrecte");
    }
    // Date trop lointaine dans le futur (> 2 ans)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2);
    if (date > maxDate) {
      throw new Error("Date du rendez-vous trop éloignée dans le futur");
    }
    // Date réelle (31 février etc.)
    const [year, month, day] = value.split("-").map(Number);
    const check = new Date(year, month - 1, day);
    if (check.getMonth() !== month - 1) {
      throw new Error("Date invalide (ex: 31 février n'existe pas)");
    }
    return true;
  });


// ─── Type (optionnel avec défaut) ─────────────────────────────────────────────

const validateType = body("type")
  .optional({ checkFalsy: true })
  .trim()
  .isIn(TYPES_RDV)
  .withMessage("Type de rendez-vous invalide")
  .custom((value) => {
    if (typeof value === "boolean" || typeof value === "number") {
      throw new Error("Type de valeur invalide");
    }
    return true;
  });

// ─── Statut (optionnel avec défaut) ──────────────────────────────────────────

const validateStatut = body("statut")
  .optional({ checkFalsy: true })
  .trim()
  .isIn(STATUTS_RDV)
  .withMessage("Statut invalide : Planifie, Confirme, Annule ou Termine")
  .custom((value) => {
    if (typeof value === "boolean" || typeof value === "number") {
      throw new Error("Type de valeur invalide");
    }
    return true;
  });

// ─── Commentaire (optionnel) ──────────────────────────────────────────────────

const validateCommentaire = body("commentaire")
  .optional({ nullable: true, checkFalsy: true })
  .trim()
  .isLength({ max: 1000 })
  .withMessage("Le commentaire ne peut pas dépasser 1000 caractères")
  .custom((value) => {
    if (!value) return true;
    if (/\u0000|%00/.test(value)) throw new Error("Caractère interdit détecté");
    if (/<script|javascript:|on\w+=/i.test(value)) {
      throw new Error("Contenu invalide détecté");
    }
    return true;
  });

// ─── Exports ──────────────────────────────────────────────────────────────────

export const validateCreateRendezVous = [
  validateDate,
  validateHeure,
  validateType,
  validateStatut,
  validateCommentaire,
  handleValidation,
];

export const validateUpdateRendezVous = [
  validateDate,
  validateHeure,
  validateType,
  validateStatut,
  validateCommentaire,
  handleValidation,
];
