import { body } from "express-validator";
import { handleValidation } from "./handleValidation.js";

// ─── Constantes ───────────────────────────────────────────────────────────────

const APPAREILS_IDS_MAX = 10; // ref_appareil_fonctionnel a 10 entrées

const SIGNES_FONCTIONNELS_KEYS = [
  "fievre",
  "toux",
  "dyspnee",
  "sueurs_nocturnes",
  "cephalee",
  "rhinorrhee",
  "troubles_visuels",
  "diarrhee",
  "douleurs_abdomen",
  "nausees",
  "dysphagie",
  "prurit",
  "paresthesie",
  "myalgie",
  "arthralgie",
  "anorexie",
  "insomnie",
  "troubles_humeur",
  "asthenie",
  "crampes",
  "troubles_libido",
  "ras",
];

// ─── Helper booléen générique ─────────────────────────────────────────────────

const validateBoolean = (fieldName) =>
  body(fieldName)
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined) return true;
      if (typeof value === "boolean") return true;
      if (value === "true" || value === "false") return true;
      if (value === 0 || value === 1) return true;
      throw new Error(`${fieldName} doit être un booléen`);
    });

// ══════════════════════════════════════════════════════════════════════════════
// EXAMEN CLINIQUE — date_examen
// ══════════════════════════════════════════════════════════════════════════════

// const validateDateExamen = body("date_examen")
//   .trim()
//   .notEmpty()
//   .withMessage("La date de l'examen est requise")
//   .isISO8601()
//   .withMessage(
//     "Format de date invalide (attendu: YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss)",
//   )
//   .custom((value) => {
//     // Timestamp Unix à la place d'une date ISO
//     if (/^\d{10,13}$/.test(value)) {
//       throw new Error("Utilisez le format YYYY-MM-DD");
//     }

//     const date = new Date(value);
//     const today = new Date();

//     // Date dans le futur
//     if (date > today) {
//       throw new Error("La date de l'examen ne peut pas être dans le futur");
//     }

//     // Date irréaliste
//     if (date.getFullYear() < 1900) {
//       throw new Error("Date de l'examen incorrecte");
//     }

//     return true;
//   });

// export const validateCreateExamen = [validateDateExamen, handleValidation];

// export const validateUpdateExamen = [validateDateExamen, handleValidation];

// ══════════════════════════════════════════════════════════════════════════════
// HABITUDES DE VIE — 4 booléens
// ══════════════════════════════════════════════════════════════════════════════

export const validateHabitudesVie = [
  validateBoolean("tabagisme"),
  validateBoolean("alcoolemie"),
  validateBoolean("toxicomanie"),
  validateBoolean("activite_physique"),
  handleValidation,
];

// ══════════════════════════════════════════════════════════════════════════════
// OBSERVATIONS — remarque
// ══════════════════════════════════════════════════════════════════════════════

export const validateObservation = [
  body("remarque")
    .trim()
    .notEmpty()
    .withMessage("La remarque est requise")
    .isLength({ min: 3 })
    .withMessage("La remarque doit contenir au moins 3 caractères")
    .isLength({ max: 5000 })
    .withMessage("La remarque ne peut pas dépasser 5000 caractères")
    .custom((value) => {
      // Espaces uniquement
      if (/^\s+$/.test(value)) {
        throw new Error(
          "La remarque ne peut pas contenir uniquement des espaces",
        );
      }
      // Null bytes
      if (/\u0000|%00/.test(value)) {
        throw new Error("Caractère interdit détecté");
      }
      // XSS basique
      if (/<script|javascript:|on\w+=/i.test(value)) {
        throw new Error("Contenu invalide détecté");
      }
      return true;
    }),
  handleValidation,
];

// ══════════════════════════════════════════════════════════════════════════════
// SIGNES CLINIQUES — poids, taille, imc
// ══════════════════════════════════════════════════════════════════════════════

const validateTaille = body("taille")
  .notEmpty()
  .withMessage("La taille est requise")
  .isFloat({ min: 1, max: 250 })
  .withMessage("La taille doit être entre 1 et 250 cm")
  .custom((value) => {
    // Valeur négative
    if (Number(value) <= 0) throw new Error("La taille doit être positive");
    // Valeur irréaliste
    if (Number(value) > 250) throw new Error("Taille irréaliste (max 250 cm)");
    return true;
  });

const validatePoids = body("poids")
  .notEmpty()
  .withMessage("Le poids est requis")
  .isFloat({ min: 1, max: 300 })
  .withMessage("Le poids doit être entre 1 et 300 kg")
  .custom((value) => {
    if (Number(value) <= 0) throw new Error("Le poids doit être positif");
    if (Number(value) > 300) throw new Error("Poids irréaliste (max 300 kg)");
    return true;
  });

const validateImc = body("imc")
  .optional({ nullable: true, checkFalsy: true })
  .isFloat({ min: 1, max: 100 })
  .withMessage("IMC invalide (entre 1 et 100)")
  .custom((value) => {
    if (!value) return true;
    if (Number(value) <= 0) throw new Error("IMC doit être positif");
    return true;
  });

export const validateSignesCliniques = [
  validateTaille,
  validatePoids,
  validateImc,
  handleValidation,
];

// ══════════════════════════════════════════════════════════════════════════════
// AUTRES SIGNES CLINIQUES — appareil_id, description
// ══════════════════════════════════════════════════════════════════════════════

const validateAutresSignes = (prefix = "") => [
  body(`${prefix}appareil_id`)
    .notEmpty()
    .withMessage("L'appareil est requis")
    .custom((value) => {
      if (isNaN(value) || !Number.isInteger(Number(value))) {
        throw new Error("Identifiant appareil invalide");
      }
      if (Number(value) <= 0) throw new Error("Identifiant appareil invalide");
      if (Number(value) > APPAREILS_IDS_MAX) {
        throw new Error("Appareil inexistant");
      }
      return true;
    }),

  body(`${prefix}description`)
    .trim()
    .notEmpty()
    .withMessage("La description est requise")
    .isLength({ min: 2 })
    .withMessage("Description trop courte (min 2 caractères)")
    .isLength({ max: 1000 })
    .withMessage("Description trop longue (max 1000 caractères)")
    .custom((value) => {
      if (/^\s+$/.test(value))
        throw new Error(
          "La description ne peut pas contenir uniquement des espaces",
        );
      if (/\u0000|%00/.test(value))
        throw new Error("Caractère interdit détecté");
      if (/<script|javascript:|on\w+=/i.test(value))
        throw new Error("Contenu invalide détecté");
      return true;
    }),
];

export const validateAutreSigneClinique = [
  ...validateAutresSignes(),
  handleValidation,
];

// ══════════════════════════════════════════════════════════════════════════════
// SIGNES FONCTIONNELS — 22 booléens + logique RAS
// ══════════════════════════════════════════════════════════════════════════════

const signesFonctionnelsValidators = SIGNES_FONCTIONNELS_KEYS.map((key) =>
  validateBoolean(key),
);

const validateRasLogic = body("ras")
  .optional({ nullable: true })
  .custom((value, { req }) => {
    const ras = value === true || value === "true";

    if (ras) {
      // Si RAS coché, aucun autre signe ne doit être true
      const autresSignesActifs = SIGNES_FONCTIONNELS_KEYS.filter(
        (k) => k !== "ras",
      ).some((k) => {
        const v = req.body[k];
        return v === true || v === "true" || v === 1;
      });

      if (autresSignesActifs) {
        throw new Error(
          "Si RAS est coché, aucun autre signe fonctionnel ne peut être actif",
        );
      }
    }
    return true;
  });

export const validateSignesFonctionnels = [
  ...signesFonctionnelsValidators,
  validateRasLogic,
  handleValidation,
];

// ══════════════════════════════════════════════════════════════════════════════
// AUTRES SIGNES FONCTIONNELS — appareil_id, description
// ══════════════════════════════════════════════════════════════════════════════

export const validateAutreSigneFonctionnel = [
  ...validateAutresSignes(),
  handleValidation,
];
