//this fonction is shared with all  validators.
import { validationResult } from "express-validator";

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  // si aucune erreur -> continuer
  if (errors.isEmpty()) {
    return next();
  }

  // formatter les erreurs
  const formattedErrors = errors.array().map((err) => ({
    field: err.path,
    message: err.msg,
    location: err.location
  }));

  // log pour debug (optionnel en production)
  console.warn("Validation error:", {
    route: req.originalUrl,
    method: req.method,
    errors: formattedErrors,
  });

  return res.status(400).json({
    success: false,
    code: "VALIDATION_ERROR",
    message: "Erreur de validation des données envoyées.",
    errors: formattedErrors,
  });
};
