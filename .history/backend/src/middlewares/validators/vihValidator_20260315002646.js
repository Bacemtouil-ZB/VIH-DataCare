import { body } from "express-validator";
import { handleValidation } from "./handleValidation.js";

// ─── Valeurs autorisées (miroir exact de vihConstants.js) ─────────────────────

const MODES_CONTAMINATION = [
  "A.E.S",
  "Homosexuel",
  "Bisexuel",
  "Hémophile",
  "Hétérosexuel",
  "Mère/Nouveau-né",
  "Toxicomanie IV",
  "Transfusion",
  "Hémophilie",
  "Inconnu",
  "Autre",
];

const TYPES_DEPISTAGE = ["Trod", "Elisa", "Autres"];

const CIRCONSTANCES_DECOUVERTE = [
  "Proposition d'une association",
  "Proposition à l'initiative du patient",
  "Proposition du médecin",
  "Demande du patient",
  "Autres circonstances",
];

const STADES_CDC = [
  "A0",
  "A1",
  "A2",
  "A3",
  "B0",
  "B1",
  "B2",
  "B3",
  "C0",
  "C1",
  "C2",
  "C3",
];

const STADES_C = ["C0", "C1", "C2", "C3"];

const TYPAGE_HLA_OPTIONS = ["Positif", "Négatif"];

// ─── Helper date générique ────────────────────────────────────────────────────

const validateDatePast = (value, fieldName) => {
  if (!value) return true;

  // Timestamp Unix à la place d'une date ISO
  if (/^\d{10,13}$/.test(value)) {
    throw new Error(`${fieldName} : utilisez le format YYYY-MM-DD`);
  }

  const date = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Date dans le futur
  if (date > today) {
    throw new Error(`${fieldName} ne peut pas être dans le futur`);
  }

  // Date irréaliste (avant 1900)
  if (date.getFullYear() < 1900) {
    throw new Error(`${fieldName} semble incorrecte`);
  }

  // Date réelle (ex: 31 février)
  const [year, month, day] = value.split("-").map(Number);
  const check = new Date(year, month - 1, day);
  if (check.getMonth() !== month - 1) {
    throw new Error(`${fieldName} invalide (ex: 31 février n'existe pas)`);
  }

  return true;
};

// ─── Mode de contamination (requis - tableau) ─────────────────────────────────

// const validateModeContamination = body("mode_contamination")
//   .notEmpty()
//   .withMessage("Le mode de contamination est requis")
//   .custom((value) => {
//     if (!Array.isArray(value)) {
//       throw new Error("Le mode de contamination doit être un tableau");
//     }
//     if (value.length === 0) {
//       throw new Error("Sélectionnez au moins un mode de contamination");
//     }
//     if (value.length > MODES_CONTAMINATION.length) {
//       throw new Error("Trop de modes de contamination sélectionnés");
//     }
//     for (const item of value) {
//       if (typeof item !== "string") {
//         throw new Error("Chaque mode doit être une chaîne de caractères");
//       }
//       if (!MODES_CONTAMINATION.includes(item)) {
//         throw new Error(`Mode de contamination invalide : ${item}`);
//       }
//     }
//     if (new Set(value).size !== value.length) {
//       throw new Error("Doublons détectés dans les modes de contamination");
//     }
//     return true;
//   });

// ─── Type de dépistage (requis) ───────────────────────────────────────────────

const validateTypeDepistage = body("type_depistage")
  .trim()
  .notEmpty()
  .withMessage("Le type de dépistage est requis")
  .isIn(TYPES_DEPISTAGE)
  .withMessage("Type de dépistage invalide")
  .isLength({ max: 20 })
  .withMessage("Type de dépistage trop long");

// ─── Circonstance de découverte (requis) ──────────────────────────────────────

const validateCirconstanceDecouverte = body("circonstance_decouverte")
  .trim()
  .notEmpty()
  .withMessage("La circonstance de découverte est requise")
  .isIn(CIRCONSTANCES_DECOUVERTE)
  .withMessage("Circonstance de découverte invalide")
  .isLength({ max: 100 })
  .withMessage("Circonstance de découverte trop longue");

// ─── Date dernière négative (optionnel) ───────────────────────────────────────

const validateDateDerniereNegative = body("date_derniere_negative")
  .optional({ nullable: true, checkFalsy: true })
  .isDate({ format: "YYYY-MM-DD", strictMode: true })
  .withMessage("Format invalide (attendu: YYYY-MM-DD)")
  .custom((value) =>
    validateDatePast(value, "La date du dernier test négatif"),
  );

// ─── Date de contamination (optionnel) ───────────────────────────────────────

const validateDateContamination = body("date_contamination")
  .optional({ nullable: true, checkFalsy: true })
  .isDate({ format: "YYYY-MM-DD", strictMode: true })
  .withMessage("Format invalide (attendu: YYYY-MM-DD)")
  .custom((value) => validateDatePast(value, "La date de contamination"));

// ─── Date VIH positif (requis) ────────────────────────────────────────────────

const validateDateVihPositif = body("date_vih_positif")
  .trim()
  .notEmpty()
  .withMessage("La date du test VIH positif est obligatoire")
  .isDate({ format: "YYYY-MM-DD", strictMode: true })
  .withMessage("Format invalide (attendu: YYYY-MM-DD)")
  .custom((value) => validateDatePast(value, "La date du test VIH positif"));

// ─── Stade CDC (requis) ───────────────────────────────────────────────────────

const validateStadeCdc = body("stade_cdc")
  .trim()
  .notEmpty()
  .withMessage("Le stade CDC est requis")
  .isIn(STADES_CDC)
  .withMessage("Stade CDC invalide")
  .isLength({ max: 10 })
  .withMessage("Stade CDC trop long");

// ─── Début stade C (conditionnel) ────────────────────────────────────────────

const validateDebutStadeC = body("debut_stade_c")
  .optional({ nullable: true, checkFalsy: true })
  .isDate({ format: "YYYY-MM-DD", strictMode: true })
  .withMessage("Format invalide (attendu: YYYY-MM-DD)")
  .custom((value, { req }) => {
    if (!value) {
      // Requis si stade C
      if (STADES_C.includes(req.body.stade_cdc)) {
        throw new Error(
          "La date de début du stade C est requise pour un stade C",
        );
      }
      return true;
    }
    return validateDatePast(value, "Le début du stade C");
  });

// ─── Typage HLA-B5701 (requis) ────────────────────────────────────────────────

const validateTypageHla = body("typage_hla_b5701")
  .trim()
  .notEmpty()
  .withMessage("Le typage HLA-B5701 est requis")
  .isIn(TYPAGE_HLA_OPTIONS)
  .withMessage("Valeur HLA-B5701 invalide : Positif ou Négatif");

// ─── Profil de séroconversion (optionnel - booléen) ───────────────────────────

const validateProfilSeroconversion = body("profil_seroconversion")
  .optional({ nullable: true })
  .custom((value) => {
    if (value === null || value === undefined) return true;

    // Booléen natif
    if (typeof value === "boolean") return true;

    // String "true"/"false" acceptée (envoi formulaire)
    if (value === "true" || value === "false") return true;

    throw new Error(
      "Profil de séroconversion invalide : true ou false uniquement",
    );
  });

// ─── Cohérence des dates (middleware séparé) ──────────────────────────────────

export const validateDateLogic = (req, res, next) => {
  const {
    date_derniere_negative,
    date_contamination,
    date_vih_positif,
    debut_stade_c,
    stade_cdc,
  } = req.body;

  const datePositif = date_vih_positif ? new Date(date_vih_positif) : null;
  const dateNeg =
    date_derniere_negative ? new Date(date_derniere_negative) : null;
  const dateCont = date_contamination ? new Date(date_contamination) : null;
  const dateStadeC =
    STADES_C.includes(stade_cdc) && debut_stade_c ?
      new Date(debut_stade_c)
    : null;

  // date_neg < date_positif
  if (dateNeg && datePositif && dateNeg >= datePositif) {
    return res.status(400).json({
      success: false,
      message:
        "La date du dernier test négatif doit être antérieure à la date VIH positif",
    });
  }

  // date_contamination < date_positif
  if (dateCont && datePositif && dateCont >= datePositif) {
    return res.status(400).json({
      success: false,
      message:
        "La date de contamination doit être antérieure à la date VIH positif",
    });
  }

  // date_neg < date_contamination
  if (dateNeg && dateCont && dateNeg >= dateCont) {
    return res.status(400).json({
      success: false,
      message:
        "La date du dernier test négatif doit être antérieure à la date de contamination",
    });
  }

  // debut_stade_c >= date_positif
  if (dateStadeC && datePositif && dateStadeC < datePositif) {
    return res.status(400).json({
      success: false,
      message: "Le début du stade C ne peut pas être avant la date VIH positif",
    });
  }

  next();
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const validateCreateVih = [
  // validateModeContamination,
  validateTypeDepistage,
  validateCirconstanceDecouverte,
  validateDateDerniereNegative,
  validateDateContamination,
  validateDateVihPositif,
  validateStadeCdc,
  validateDebutStadeC,
  validateTypageHla,
  validateProfilSeroconversion,
  handleValidation,
  validateDateLogic,
];

export const validateUpdateVih = [
  // validateModeContamination,
  validateTypeDepistage,
  validateCirconstanceDecouverte,
  validateDateDerniereNegative,
  validateDateContamination,
  validateDateVihPositif,
  validateStadeCdc,
  validateDebutStadeC,
  validateTypageHla,
  validateProfilSeroconversion,
  handleValidation,
  validateDateLogic,
];
