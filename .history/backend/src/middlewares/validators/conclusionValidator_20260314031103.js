import { body } from "express-validator";
import { handleValidation } from "./handleValidation.js";

// ─── Contenu de la conclusion (requis) ───────────────────────────────────────

const validateContent = body("content")
  .trim()
  .notEmpty()
  .withMessage("Le contenu de la conclusion est requis")
  .isLength({ min: 10 })
  .withMessage("La conclusion doit contenir au moins 10 caractères")
  .isLength({ max: 50000 })
  .withMessage("La conclusion ne peut pas dépasser 50000 caractères")
  .custom((value) => {
    // Espaces uniquement
    if (/^\s+$/.test(value)) {
      throw new Error("Le contenu ne peut pas contenir uniquement des espaces");
    }
    // Null bytes
    if (/\u0000|%00/.test(value)) {
      throw new Error("Caractère interdit détecté");
    }
    // Scripts malveillants — attention: content peut contenir du HTML (dangerouslySetInnerHTML)
    if (/<script[\s>]|javascript:\s*[^\s]/i.test(value)) {
      throw new Error("Contenu invalide détecté");
    }
    return true;
  });

export const validateCreateConclusion = [validateContent, handleValidation];

export const validateUpdateConclusion = [validateContent, handleValidation];
