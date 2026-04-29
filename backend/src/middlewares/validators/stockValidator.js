import { body, param } from "express-validator";
import { handleValidation } from "./handleValidation.js";

const FORBIDDEN_PATTERNS =
  /<[^>]*>|javascript:|on\w+=|script|SELECT\s+|INSERT\s+|DROP\s+|UPDATE\s+|DELETE\s+|UNION\s+|--|\$\{|\{\{/i;

const containsMalicious = (value) => {
  if (FORBIDDEN_PATTERNS.test(value)) {
    throw new Error("Entree invalide detectee");
  }
  return true;
};

const validateStockId = param("id")
  .notEmpty()
  .withMessage("Identifiant de stock invalide")
  .isInt({ min: 1 })
  .withMessage("Identifiant de stock invalide");

const validateCode = body("code")
  .trim()
  .notEmpty()
  .withMessage("Le code du medicament est requis")
  .isLength({ max: 30 })
  .withMessage("Le code du medicament ne peut pas depasser 30 caracteres")
  .custom((value) => {
    containsMalicious(value);
    return true;
  });

const validateComposition = body("composition")
  .trim()
  .notEmpty()
  .withMessage("La composition du medicament est requise")
  .isLength({ max: 255 })
  .withMessage("La composition du medicament ne peut pas depasser 255 caracteres")
  .custom((value) => {
    containsMalicious(value);
    return true;
  });

const validateInitialQuantity = body("quantite")
  .exists({ checkNull: true })
  .withMessage("La quantite initiale est obligatoire")
  .isInt({ min: 1 })
  .withMessage("La quantite initiale doit etre un entier strictement positif");

const validateQuantity = body("quantite")
  .exists({ checkNull: true })
  .withMessage("La quantite est obligatoire")
  .isInt({ min: 0 })
  .withMessage("La quantite doit etre un entier positif");

export const validateCreateStockItem = [
  validateCode,
  validateComposition,
  validateInitialQuantity,
  handleValidation,
];

export const validateUpdateStockQuantity = [
  validateStockId,
  validateQuantity,
  handleValidation,
];

export const validateDeleteStockItem = [
  validateStockId,
  handleValidation,
];
