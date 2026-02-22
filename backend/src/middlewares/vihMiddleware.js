import { body, validationResult } from "express-validator";

//  pour vérifier les erreurs de validation
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Validation personnalisée pour les dates
const validateDate = (value, fieldName) => {
  if (!value) return true; // Optional field
  
  const date = new Date(value);
  const today = new Date();
  if (date > today) {
    throw new Error(`${fieldName} ne peut pas être dans le futur`);
  }

  return true;
};

// Validation personnalisée pour la cohérence des dates
const validateDateLogic = (req, res, next) => {
  const {
    date_derniere_negative,
    date_contamination,
    date_vih_positif,
    debut_stade_c,
  } = req.body;

  // Si date_derniere_negative existe, elle doit être avant date_vih_positif
  if (date_derniere_negative && date_vih_positif) {
    const dateNegative = new Date(date_derniere_negative);
    const datePositif = new Date(date_vih_positif);

    if (dateNegative >= datePositif) {
      return res.status(400).json({
        success: false,
        message:
          "La date du dernier test négatif doit être antérieure à la date du test VIH positif",
      });
    }
  }

  // Si date_contamination existe, elle doit être avant ou égale à date_vih_positif
  if (date_contamination && date_vih_positif) {
    const dateContam = new Date(date_contamination);
    const datePositif = new Date(date_vih_positif);

    if (dateContam > datePositif) {
      return res.status(400).json({
        success: false,
        message:
          "La date de contamination ne peut pas être postérieure à la date du test VIH positif",
      });
    }
  }

  next();
};


export const validateCreateVih = [


  body("date_derniere_negative")
    .isDate()
    .withMessage("La date du dernier test négatif doit être une date valide (YYYY-MM-DD)")
    ,

  body("date_contamination")
    .isDate()
    .withMessage("La date de contamination doit être une date valide (YYYY-MM-DD)")
    .custom((value) => validateDate(value, "La date de contamination")),

  body("date_vih_positif")
    .isDate()
    .withMessage("La date du test VIH positif doit être une date valide (YYYY-MM-DD)")
    .custom((value) => validateDate(value, "La date du test VIH positif")),

  body("debut_stade_c")
    .isDate()
    .withMessage("La date de début du stade C doit être une date valide (YYYY-MM-DD)")
    .custom((value) => validateDate(value, "La date de début du stade C")),
  handleValidationErrors,
  validateDateLogic,
];
