import { body } from "express-validator";
import { handleValidation } from "./handleValidation.js";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS PARTAGÉS
// ─────────────────────────────────────────────────────────────────────────────

const FORBIDDEN_PATTERNS =
  /<[^>]*>|javascript:|on\w+=|script|SELECT\s+|INSERT\s+|DROP\s+|UPDATE\s+|DELETE\s+|UNION\s+|--|\$\{|\{\{/i;

const containsMalicious = (value) => {
  if (FORBIDDEN_PATTERNS.test(value)) {
    throw new Error("Entrée invalide détectée");
  }
  return true;
};

// ─── Champ texte libre optionnel (anti-injection) ─────────────────────────────
// Réutilisé pour : remarque, observation, autres, complications,
//                 suivi_gynecologique, depistage_cancer_col,
//                 description, medicaments_chroniques, allergies_medicaments
const makeOptionalText = (field, minLength = 3) =>
  body(field)
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: minLength})
    .withMessage(`Le champ "${field}" doit contenir au moins ${minLength} `)
    .custom((value) => {
      if (!value) return true;
      if (/\u0000|%00/.test(value)) throw new Error("Caractère interdit détecté");
      containsMalicious(value);
      return true;
    });

// ─── Champ texte obligatoire (anti-injection) ─────────────────────────────────
// Réutilisé pour : tpe_nom_traitement, prep_nom_traitement
const makeRequiredText = (field, maxLength = 500) =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(`Le champ "${field}" est requis`)
    .isLength({ min: 1, max: maxLength })
    .withMessage(`Le champ "${field}" ne peut pas dépasser ${maxLength} caractères`)
    .custom((value) => {
      if (/\u0000|%00/.test(value)) throw new Error("Caractère interdit détecté");
      containsMalicious(value);
      return true;
    });

// ─── Date optionnelle (format YYYY-MM-DD, pas dans le futur) ─────────────────
// Réutilisé pour : date_intervention, date_transfusion,
//                 tpe_date, prep_date, *_date (habitudesVie)
const makeOptionalDate = (field) =>
  body(field)
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isDate({ format: "YYYY-MM-DD", strictMode: true })
    .withMessage(`Format de date invalide pour "${field}" (attendu : YYYY-MM-DD)`)
    .custom((value) => {
      if (!value) return true;
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date > today) {
        throw new Error(`La date "${field}" ne peut pas être dans le futur`);
      }
      // Vérification date réelle (ex: 31 février)
      const [year, month, day] = value.split("-").map(Number);
      const check = new Date(year, month - 1, day);
      if (check.getMonth() !== month - 1) {
        throw new Error(`Date invalide pour "${field}" (ex: 31 février n'existe pas)`);
      }
      return true;
    });

// ─── Date requise (même règles, mais notEmpty) ────────────────────────────────
const makeRequiredDate = (field) =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(`La date "${field}" est requise`)
    .isDate({ format: "YYYY-MM-DD", strictMode: true })
    .withMessage(`Format de date invalide pour "${field}" (attendu : YYYY-MM-DD)`)
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date > today) {
        throw new Error(`La date "${field}" ne peut pas être dans le futur`);
      }
      const [year, month, day] = value.split("-").map(Number);
      const check = new Date(year, month - 1, day);
      if (check.getMonth() !== month - 1) {
        throw new Error(`Date invalide pour "${field}" (ex: 31 février n'existe pas)`);
      }
      return true;
    });

// ─── Entier positif optionnel (champs numériques gynéco) ──────────────────────
const makeOptionalPositiveInt = (field) =>
  body(field)
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .custom((value) => {
      if (value === "" || value === null || value === undefined) return true;
      const num = Number(value);
      if (!Number.isInteger(num)) {
        throw new Error(`"${field}" doit être un nombre entier`);
      }
      if (num < 0) {
        throw new Error(`"${field}" ne peut pas être négatif`);
      }
      if (num > 99) {
        throw new Error(`"${field}" semble invalide (valeur trop élevée)`);
      }
      return true;
    });

// ─────────────────────────────────────────────────────────────────────────────
// ANTÉCÉDENTS FAMILIAUX
// Champs booléens : diabete, hypertension, cardiopathies, insuffisance_renale,
//                  maladies_hepatiques, asthme_bpco, cancers  → pas de validation
// Champs texte   : autres, remarque
// ─────────────────────────────────────────────────────────────────────────────

export const validateFamily = [
  makeOptionalText("autres"),
  makeOptionalText("remarque"),
  handleValidation,
];

// ─────────────────────────────────────────────────────────────────────────────
// ANTÉCÉDENTS MÉDICAUX
// Champs booléens : diabete, hypertension, cardiopathies, insuffisance_renale,
//                  maladies_hepatiques, asthme_bpco, cancers  → pas de validation
// Champs texte   : autres, remarque
// ─────────────────────────────────────────────────────────────────────────────

export const validateMedical = [
  makeOptionalText("autres"),
  makeOptionalText("remarque"),
  handleValidation,
];

// ─────────────────────────────────────────────────────────────────────────────
// ANTÉCÉDENTS GYNÉCOLOGIQUES
// Logique métier :
//   - gestite, parite, avortement → entiers ≥ 0, optionnels
//   - parite ≤ gestite
//   - avortement ≤ gestite - parite
//   - complications, suivi_gynecologique, depistage_cancer_col, remarque → texte optionnel
// ─────────────────────────────────────────────────────────────────────────────

export const validateGyneco = [
  makeOptionalPositiveInt("gestite"),
  makeOptionalPositiveInt("parite"),
  makeOptionalPositiveInt("avortement"),

  // Validation croisée gestite / parite / avortement
  body("parite").custom((parite, { req }) => {
    const gestite = req.body.gestite;

    // Si l'un des deux est absent, on ne valide pas le ratio
    if (gestite === "" || gestite == null || parite === "" || parite == null) {
      return true;
    }

    const g = Number(gestite);
    const p = Number(parite);

    if (!Number.isFinite(g) || !Number.isFinite(p)) return true;

    if (p > g) {
      throw new Error(
        `La parité (${p}) ne peut pas être supérieure à la gestité (${g})`
      );
    }
    return true;
  }),

  body("avortement").custom((avortement, { req }) => {
    const gestite = req.body.gestite;
    const parite = req.body.parite;

    if (
      avortement === "" || avortement == null ||
      gestite === "" || gestite == null ||
      parite === "" || parite == null
    ) {
      return true;
    }

    const g = Number(gestite);
    const p = Number(parite);
    const a = Number(avortement);

    if (!Number.isFinite(g) || !Number.isFinite(p) || !Number.isFinite(a)) return true;

    const maxAvortement = g - p;
    if (a > maxAvortement) {
      throw new Error(
        `Les avortements (${a}) ne peuvent pas dépasser gestité - parité (${maxAvortement})`
      );
    }
    return true;
  }),

  makeOptionalText("complications"),
  makeOptionalText("suivi_gynecologique"),
  makeOptionalText("depistage_cancer_col"),
  makeOptionalText("remarque"),
  handleValidation,
];

// ─────────────────────────────────────────────────────────────────────────────
// HABITUDES DE VIE
// Champs booléens : tabagisme, alcoolemie, activite_physique, chicha,
//                  cafeine_excessive, proteines, creatine,
//                  complements_vitaminiques, multivitamines, plantes_medicinales,
//                  autres_complements, drogues_injectables, cannabis, cocaine,
//                  crack, heroine, ecstasy, pregabaline, tramadol, codeine
//                  → pas de validation
// Champs texte   : *_type  → optionnel anti-injection
// Champs date    : *_date  → optionnel, format YYYY-MM-DD, pas dans le futur
// ─────────────────────────────────────────────────────────────────────────────

export const validateHabitudesVie = [
  // ── Compléments : champs type ──
  makeOptionalText("complements_vitaminiques_type", 500),
  makeOptionalText("multivitamines_type", 500),
  makeOptionalText("plantes_medicinales_type", 500),
  makeOptionalText("autres_complements_type", 500),

  // ── Compléments : champs date ──
  makeOptionalDate("proteines_date"),
  makeOptionalDate("creatine_date"),
  makeOptionalDate("complements_vitaminiques_date"),
  makeOptionalDate("multivitamines_date"),
  makeOptionalDate("plantes_medicinales_date"),
  makeOptionalDate("autres_complements_date"),

  // ── Drogues : champs date ──
  makeOptionalDate("drogues_injectables_date"),
  makeOptionalDate("cannabis_date"),
  makeOptionalDate("cocaine_date"),
  makeOptionalDate("crack_date"),
  makeOptionalDate("heroine_date"),
  makeOptionalDate("ecstasy_date"),
  makeOptionalDate("pregabaline_date"),
  makeOptionalDate("tramadol_date"),
  makeOptionalDate("codeine_date"),

  handleValidation,
];

// ─────────────────────────────────────────────────────────────────────────────
// ANTÉCÉDENTS CHIRURGICAUX
// description : texte optionnel anti-injection
// date_intervention : date optionnelle
// remarque : texte optionnel anti-injection
// ─────────────────────────────────────────────────────────────────────────────

export const validateCreateSurgical = [
  makeOptionalText("description"),
  makeOptionalDate("date_intervention"),
  makeOptionalText("remarque"),
  handleValidation,
];

export const validateUpdateSurgical = [
  makeOptionalText("description"),
  makeOptionalDate("date_intervention"),
  makeOptionalText("remarque"),
  handleValidation,
];

// ─────────────────────────────────────────────────────────────────────────────
// ANTÉCÉDENTS THÉRAPEUTIQUES
// medicaments_chroniques : texte optionnel anti-injection
// allergies_medicaments  : texte optionnel anti-injection
// remarque               : texte optionnel anti-injection
// ─────────────────────────────────────────────────────────────────────────────

export const validateTherapeutic = [
  makeOptionalText("medicaments_chroniques"),
  makeOptionalText("allergies_medicaments"),
  makeOptionalText("remarque"),
  handleValidation,
];

// ─────────────────────────────────────────────────────────────────────────────
// TPE / PrEP
// tpe_nom_traitement : REQUIS, texte anti-injection
// tpe_date           : date optionnelle
// prep_nom_traitement: REQUIS, texte anti-injection
// prep_date          : date optionnelle
// remarque           : texte optionnel anti-injection
// ─────────────────────────────────────────────────────────────────────────────

export const validateCreateTpePrep = [
  makeRequiredText("tpe_nom_traitement"),
  makeOptionalDate("tpe_date"),
  makeRequiredText("prep_nom_traitement"),
  makeOptionalDate("prep_date"),
  makeOptionalText("remarque"),
  handleValidation,
];

export const validateUpdateTpePrep = [
  makeRequiredText("tpe_nom_traitement"),
  makeOptionalDate("tpe_date"),
  makeRequiredText("prep_nom_traitement"),
  makeOptionalDate("prep_date"),
  makeOptionalText("remarque"),
  handleValidation,
];

// ─────────────────────────────────────────────────────────────────────────────
// TRANSFUSIONS
// date_transfusion : date optionnelle
// remarque         : texte optionnel anti-injection
// ─────────────────────────────────────────────────────────────────────────────

export const validateCreateTransfusion = [
  makeOptionalDate("date_transfusion"),
  makeOptionalText("remarque"),
  handleValidation,
];

export const validateUpdateTransfusion = [
  makeOptionalDate("date_transfusion"),
  makeOptionalText("remarque"),
  handleValidation,
];