import { body, validationResult } from "express-validator";

<<<<<<< HEAD
// Middleware pour vérifier les erreurs de validation
=======
//  pour vérifier les erreurs de validation
>>>>>>> origin/feature/vih
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

<<<<<<< HEAD
=======
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
>>>>>>> origin/feature/vih
const validateDateLogic = (req, res, next) => {
  const {
    date_derniere_negative,
    date_contamination,
    date_vih_positif,
<<<<<<< HEAD
=======
    debut_stade_c,
>>>>>>> origin/feature/vih
  } = req.body;

  // Si date_derniere_negative existe, elle doit être avant date_vih_positif
  if (date_derniere_negative && date_vih_positif) {
    const dateNegative = new Date(date_derniere_negative);
    const datePositif = new Date(date_vih_positif);

    if (dateNegative >= datePositif) {
      return res.status(400).json({
        success: false,
<<<<<<< HEAD
        message: "La date du dernier test négatif doit être antérieure à la date du test VIH positif",
=======
        message:
          "La date du dernier test négatif doit être antérieure à la date du test VIH positif",
>>>>>>> origin/feature/vih
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
<<<<<<< HEAD
        message: "La date de contamination ne peut pas être postérieure à la date du test VIH positif",
=======
        message:
          "La date de contamination ne peut pas être postérieure à la date du test VIH positif",
>>>>>>> origin/feature/vih
      });
    }
  }

  next();
};

<<<<<<< HEAD
// Validation pour la création
export const validateCreateVih = [
  body("mode_contamination")
    .notEmpty()
    .withMessage("Le mode de contamination est obligatoire")
    ,
  body("type_depistage")
    .notEmpty()
    .withMessage("Le type de dépistage est obligatoire")
    ,

  body("circonstance_decouverte")
    .notEmpty()
    .withMessage("La circonstance de découverte est obligatoire")
    ,

  body("date_vih_positif")
    .notEmpty()
    .withMessage("La date du test VIH positif est obligatoire")
    .isDate()
    .withMessage("La date du test VIH positif doit être une date valide (YYYY-MM-DD)")
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      if (date > today) {
        throw new Error("La date du test VIH positif ne peut pas être dans le futur");
      }
      return true;
    }),

  body("stade_cdc")
    .notEmpty()
    .withMessage("Le stade CDC est obligatoire")
    ,

  body("typage_hla_b5701")
    .notEmpty()
    .withMessage("Le typage HLA-B5701 est obligatoire")
    ,

  body("date_derniere_negative")
    .optional({ checkFalsy: true })
    .isDate()
    .withMessage("La date du dernier test négatif doit être une date valide (YYYY-MM-DD)")
    .custom((value) => {
      if (!value) return true;
      const date = new Date(value);
      const today = new Date();
      if (date > today) {
        throw new Error("La date du dernier test négatif ne peut pas être dans le futur");
      }
      return true;
    }),

  body("date_contamination")
    .notEmpty()
    .isDate()
    .withMessage("La date de contamination doit être une date valide (YYYY-MM-DD)")
    .custom((value) => {
      if (!value) return true;
      const date = new Date(value);
      const today = new Date();
      if (date > today) {
        throw new Error("La date de contamination ne peut pas être dans le futur");
      }
      return true;
    }),
=======

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
>>>>>>> origin/feature/vih

  body("debut_stade_c")
    .isDate()
    .withMessage("La date de début du stade C doit être une date valide (YYYY-MM-DD)")
<<<<<<< HEAD
    .custom((value) => {
      if (!value) return true;
      const date = new Date(value);
      const today = new Date();
      if (date > today) {
        throw new Error("La date de début du stade C ne peut pas être dans le futur");
      }
      return true;
    }),

  body("profil_seroconversion")
    .optional()
 ,
  handleValidationErrors,
  validateDateLogic,
];

// Validation pour la mise à jour 
export const validateUpdateVih = [
  body("mode_contamination")
    .optional()
   ,
  body("type_depistage")
    .optional()
    ,

  body("circonstance_decouverte")
    .optional()
    ,

  body("date_derniere_negative")
    .optional({ checkFalsy: true })
    .isDate()
    .withMessage("La date du dernier test négatif doit être une date valide (YYYY-MM-DD)"),

  body("date_contamination")
    .optional({ checkFalsy: true })
    .isDate()
    .withMessage("La date de contamination doit être une date valide (YYYY-MM-DD)"),

  body("date_vih_positif")
    .optional({ checkFalsy: true })
    .isDate()
    .withMessage("La date du test VIH positif doit être une date valide (YYYY-MM-DD)"),

  body("stade_cdc")
    .optional()
   ,

  body("debut_stade_c")
    .optional({ checkFalsy: true })
    .isDate()
    .withMessage("La date de début du stade C doit être une date valide (YYYY-MM-DD)"),

  body("typage_hla_b5701")
    .optional()
    ,

  body("profil_seroconversion")
    .optional()
 ,

  handleValidationErrors,
  validateDateLogic,
];

=======
    .custom((value) => validateDate(value, "La date de début du stade C")),
  handleValidationErrors,
  validateDateLogic,
];
>>>>>>> origin/feature/vih
