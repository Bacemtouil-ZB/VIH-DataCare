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
    stade_cdc,
  } = req.body;

  const today       = new Date(); today.setHours(0, 0, 0, 0);
  const datePositif = date_vih_positif ? new Date(date_vih_positif) : null;
  const dateNeg     = date_derniere_negative ? new Date(date_derniere_negative) : null;
  const dateCont    = date_contamination     ? new Date(date_contamination)     : null;
  const STADES_C    = ["C0", "C1", "C2", "C3"];
  const dateStadeC  = (stade_cdc && STADES_C.includes(stade_cdc) && debut_stade_c)
    ? new Date(debut_stade_c) : null;

  // ── Règle 1 : date_neg < date_positif ────────────────────────────────────
  if (dateNeg && datePositif && dateNeg >= datePositif) {
    return res.status(400).json({
      success: false,
      message: "La date du dernier test négatif doit être strictement antérieure à la date du test VIH positif",
    });
  }

  // ── Règle 3 : date_contamination < date_positif (strictement) ────────────
  if (dateCont && datePositif && dateCont >= datePositif) {
    return res.status(400).json({
      success: false,
      message: "La date de contamination doit être strictement antérieure à la date du test VIH positif",
    });
  }

  // ── Règle 1 (suite) : date_neg < date_contamination ──────────────────────
  if (dateNeg && dateCont && dateNeg >= dateCont) {
    return res.status(400).json({
      success: false,
      message: "La date du dernier test négatif doit être antérieure à la date de contamination",
    });
  }

  // ── Règle 2 : debut_stade_c >= date_positif ───────────────────────────────
  if (dateStadeC && datePositif && dateStadeC < datePositif) {
    return res.status(400).json({
      success: false,
      message: "Le début du stade C ne peut pas survenir avant la date du test VIH positif",
    });
  }

  next();
};


export const validateCreateVih = [

  body("date_derniere_negative")
    .optional({ nullable: true, checkFalsy: true })
    .isDate()
    .withMessage("La date du dernier test négatif doit être une date valide (YYYY-MM-DD)")
    .custom((value) => validateDate(value, "La date du dernier test négatif")),

  body("date_contamination")
    .optional({ nullable: true, checkFalsy: true })
    .isDate()
    .withMessage("La date de contamination doit être une date valide (YYYY-MM-DD)")
    .custom((value) => validateDate(value, "La date de contamination")),

  body("date_vih_positif")
    .notEmpty().withMessage("La date du test VIH positif est obligatoire")
    .isDate()
    .withMessage("La date du test VIH positif doit être une date valide (YYYY-MM-DD)")
    .custom((value) => validateDate(value, "La date du test VIH positif")),

  // ✅ debut_stade_c optionnel — validé seulement si présent
  body("debut_stade_c")
    .optional({ nullable: true, checkFalsy: true })
    .isDate()
    .withMessage("La date de début du stade C doit être une date valide (YYYY-MM-DD)")
    .custom((value) => validateDate(value, "La date de début du stade C")),

  handleValidationErrors,
  validateDateLogic,
];