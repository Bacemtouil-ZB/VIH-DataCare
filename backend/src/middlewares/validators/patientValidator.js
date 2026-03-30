import { body } from "express-validator";
import { handleValidation } from "./handleValidation.js";
// ─── Helpers ──────────────────────────────────────────────────────────────────

const TUNISIAN_PHONE_REGEX = /^[24597][0-9]{7}$/;
const NUMERO_DOSSIER_REGEX = /^F-\d{4}-\d{4}$|^\d{4}-\d{4}$/;
const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'\-]+$/;
const FORBIDDEN_PATTERNS =
  /<[^>]*>|javascript:|on\w+=|script|SELECT\s+|INSERT\s+|DROP\s+|UPDATE\s+|DELETE\s+|UNION\s+|--|\$\{|\{\{/i;

const containsMalicious = (value) => {
  if (FORBIDDEN_PATTERNS.test(value)) {
    throw new Error("Entrée invalide détectée");
  }
  return true;
};

// ─── Numéro Dossier ───────────────────────────────────────────────────────────

export const validateNumero = body("numero")
  .trim()
  .notEmpty()
  .withMessage("Le numéro de dossier est requis")
  .isLength({ min: 9, max: 11 }) // 9 pour XXXX-XXXX, 11 pour F-XXXX-XXXX
  .withMessage("Le numéro doit avoir le format XXXX-XXXX ou F-XXXX-XXXX")
  .matches(NUMERO_DOSSIER_REGEX)
  .withMessage("Format invalide : ex. 0001-2026 ou F-0001-2026")
  .custom((value) => {
    // Null bytes / encodage malveillant
    if (/\u0000|%00/.test(value)) throw new Error("Caractère interdit détecté");

    // Supprime le F- pour vérifier séquence répétitive
    const cleaned = value.replace(/^F-/, "");

    if (/^(.)\1+$/.test(cleaned.replace("-", "")))
      throw new Error("Numéro invalide : séquence répétitive");

    return true;
  });

// ─── Nom ──────────────────────────────────────────────────────────────────────

const validateName = body("name")
  .trim()
  .notEmpty()
  .withMessage("Le nom est requis")
  .isLength({ min: 2, max: 100 })
  .withMessage("Le nom doit contenir entre 2 et 100 caractères")
  .matches(NAME_REGEX)
  .withMessage(
    "Le nom ne peut contenir que des lettres, espaces, apostrophes ou tirets",
  )
  .custom((value) => {
    if (/\d/.test(value))
      throw new Error("Le nom ne peut pas contenir de chiffres");
    if (/^\s+$/.test(value))
      throw new Error("Le nom ne peut pas contenir uniquement des espaces");
    if (/\s{2,}/.test(value))
      throw new Error("Espaces multiples non autorisés");
    if (/^[-'\s]+$/.test(value))
      throw new Error(
        "Le nom ne peut pas contenir uniquement des caractères spéciaux",
      );
    if (/\u0000|%00/.test(value)) throw new Error("Caractère interdit détecté");
    containsMalicious(value);
    return true;
  });

// ─── Prénom ───────────────────────────────────────────────────────────────────

const validateSurname = body("surname")
  .trim()
  .notEmpty()
  .withMessage("Le prénom est requis")
  .isLength({ min: 2, max: 100 })
  .withMessage("Le prénom doit contenir entre 2 et 100 caractères")
  .matches(NAME_REGEX)
  .withMessage(
    "Le prénom ne peut contenir que des lettres, espaces, apostrophes ou tirets",
  )
  .custom((value) => {
    if (/\d/.test(value))
      throw new Error("Le prénom ne peut pas contenir de chiffres");
    if (/^\s+$/.test(value))
      throw new Error("Le prénom ne peut pas contenir uniquement des espaces");
    if (/\s{2,}/.test(value))
      throw new Error("Espaces multiples non autorisés");
    if (/^[-'\s]+$/.test(value))
      throw new Error(
        "Le prénom ne peut pas contenir uniquement des caractères spéciaux",
      );
    if (/\u0000|%00/.test(value)) throw new Error("Caractère interdit détecté");
    containsMalicious(value);
    return true;
  });

// ─── Date de naissance ────────────────────────────────────────────────────────

const validateBirthdate = body("birthdate")
  .trim()
  .notEmpty()
  .withMessage("La date de naissance est requise")
  .isDate({ format: "YYYY-MM-DD", strictMode: true })
  .withMessage("Format de date invalide (attendu: YYYY-MM-DD)")
  .custom((value) => {
    const birth = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Date dans le futur
    if (birth > today)
      throw new Error("La date de naissance ne peut pas être dans le futur");

    // Date trop ancienne
    const age = today.getFullYear() - birth.getFullYear();
    if (age > 150)
      throw new Error("Date de naissance incorrecte (âge > 150 ans)");

    // Âge minimum (nouveau-né valide = 0 jour, mais pas date future)
    if (birth.getTime() === today.getTime()) return true; // né aujourd'hui = valide

    // Vérification date réelle (ex: 31 février)
    const [year, month, day] = value.split("-").map(Number);
    const check = new Date(year, month - 1, day);
    if (check.getMonth() !== month - 1)
      throw new Error("Date invalide (ex: 31 février n'existe pas)");

    // Timestamp Unix envoyé à la place d'une date
    if (/^\d{10,13}$/.test(value))
      throw new Error("Format invalide, utilisez YYYY-MM-DD");

    return true;
  });

// ─── Genre ────────────────────────────────────────────────────────────────────

const validateGender = body("gender")
  .trim()
  .notEmpty()
  .withMessage("Le genre est requis")
  .isIn(["homme", "femme", "transgenre"])
  .withMessage("Le genre doit être 'homme' ou 'femme' ou 'transgenre'")
  .custom((value) => {
    if (typeof value === "boolean" || typeof value === "number") {
      throw new Error("Type de valeur invalide pour le genre");
    }
    return true;
  });

// ─── Téléphone ────────────────────────────────────────────────────────────────

const validatePhone = body("phone")
  .optional({ nullable: true, checkFalsy: true })
  .trim()
  .custom((value) => {
    if (!value) return true;

    // Caractères invalides
    if (/[a-zA-Z]/.test(value))
      throw new Error("Le téléphone ne peut pas contenir de lettres");

    // Caractères spéciaux non autorisés
    if (/[^\d\s\-\+\(\)]/.test(value))
      throw new Error("Caractères invalides dans le numéro");

    // Format tunisien strict
    const cleaned = value.replace(/[\s\-\(\)]/g, "");
    if (!TUNISIAN_PHONE_REGEX.test(cleaned)) {
      throw new Error(
        "Numéro tunisien invalide (ex: 20123456 — commence par 2,4,5,7 ou 9)",
      );
    }

    // Numéro fictif / tous zéros
    if (/^0+$/.test(cleaned)) throw new Error("Numéro de téléphone invalide");

    // Séquence répétitive (11111111)
    if (/^(.)\1{7}$/.test(cleaned))
      throw new Error("Numéro de téléphone invalide");

    // Longueur exacte
    if (cleaned.length !== 8)
      throw new Error("Le numéro tunisien doit contenir exactement 8 chiffres");

    // Injection
    containsMalicious(value);

    return true;
  });
// ───Email ────────────────────────────────────────────────────────────────
export const validateEmail = body("email")
.optional({ nullable: true, checkFalsy: true })
  .isEmail()
  .withMessage("Format d'email invalide")
  .normalizeEmail() // Normalisation de l'email pour enlever les espaces superflus et traiter les variantes de majuscules/minuscules
  .custom((value) => {
    // Null bytes / encodage malveillant
    if (/\u0000|%00/.test(value)) throw new Error("Caractère interdit détecté");

    return true;
  });
// ─── Hospitalisation ──────────────────────────────────────────────────────────

const validateHospitalisation = body("hospitalisation")
  .trim()
  .notEmpty()
  .withMessage("Le type d'hospitalisation est requis")
  .isIn(["interne", "externe"])
  .withMessage("Valeur invalide : 'interne' ou 'externe' uniquement")
  .custom((value) => {
    if (typeof value === "boolean" || typeof value === "number") {
      throw new Error("Type de valeur invalide");
    }
    return true;
  });

// ─── Gouvernorat (naissance - optionnel) ──────────────────────────────────────

const validateBirthGovernorat = body("birth_governorate")
  .optional({ nullable: true, checkFalsy: true })
  .trim()
  .isLength({ max: 100 })
  .withMessage("Gouvernorat de naissance trop long")
  .custom((value) => {
    if (!value) return true;
    if (/\d/.test(value))
      throw new Error("Le gouvernorat ne peut pas contenir de chiffres");
    containsMalicious(value);
    return true;
  });

// ─── Code postal naissance (optionnel) ───────────────────────────────────────

const validateBirthPostalCode = body("birth_postal_code_id")
  .optional({ nullable: true, checkFalsy: true })
  .custom((value) => {
    if (!value) return true;
    if (isNaN(value) || !Number.isInteger(Number(value))) {
      throw new Error("Code postal de naissance invalide");
    }
    if (Number(value) <= 0) throw new Error("Code postal invalide");
    return true;
  });

// ─── Gouvernorat résidence (requis) ───────────────────────────────────────────

const validateResidenceGovernorat = body("residence_governorate")
  .optional({ nullable: true, checkFalsy: true })
  .isLength({ max: 100 })
  .withMessage("Gouvernorat de résidence trop long")
  .custom((value) => {
    if (/\d/.test(value))
      throw new Error("Le gouvernorat ne peut pas contenir de chiffres");
    containsMalicious(value);
    return true;
  });

// ─── Code postal résidence (requis) ───────────────────────────────────────────

const validateResidencePostalCode = body("residence_postal_code_id")
  .optional({ nullable: true, checkFalsy: true })
  .custom((value) => {
    if (isNaN(value) || !Number.isInteger(Number(value))) {
      throw new Error("Code postal de résidence invalide");
    }
    if (Number(value) <= 0) throw new Error("Code postal invalide");
    return true;
  });

// ─── Adresse exacte (optionnel) ───────────────────────────────────────────────

const validateExactAddress = body("exact_address")
  .optional({ nullable: true, checkFalsy: true })
  .trim()
  .isLength({ max: 500 })
  .withMessage("L'adresse ne peut pas dépasser 500 caractères")
  .custom((value) => {
    if (!value) return true;
    if (/\u0000|%00/.test(value)) throw new Error("Caractère interdit détecté");
    containsMalicious(value);
    return true;
  });

// ─── Médecin traitant (requis) ────────────────────────────────────────────────

const validateDoctorId = body("doctor_id")
  .notEmpty()
  .withMessage("Le médecin traitant est requis")
  .custom((value) => {
    if (isNaN(value) || !Number.isInteger(Number(value))) {
      throw new Error("Identifiant médecin invalide");
    }
    if (Number(value) <= 0) throw new Error("Identifiant médecin invalide");
    return true;
  });

// ─── Remarques (optionnel) ────────────────────────────────────────────────────

const validateRemarks = body("remarks")
  .optional({ nullable: true, checkFalsy: true })
  .trim()
  .isLength({ max: 2000 })
  .withMessage("Les remarques ne peuvent pas dépasser 2000 caractères")
  .custom((value) => {
    if (!value) return true;
    if (/\u0000|%00/.test(value)) throw new Error("Caractère interdit détecté");
    containsMalicious(value);
    return true;
  });

// ─── Exports ──────────────────────────────────────────────────────────────────
// handleValidation dans exportaion ou par fonction est le même, c'est juste une question de style.
// obligation d'etre après les fonctions de validation pour éviter les erreurs de référence.
export const validateCreatePatient = [
  validateNumero,
  validateName,
  validateSurname,
  validateBirthdate,
  validateGender,
  validatePhone,
  validateHospitalisation,
  validateBirthGovernorat,
  validateBirthPostalCode,
  validateResidenceGovernorat,
  validateResidencePostalCode,
  validateExactAddress,
    validateRemarks,
  validateEmail,
  handleValidation,
  
];

export const validateUpdatePatient = [
  validateName,
  validateSurname,
  validateBirthdate,
  validateGender,
  validatePhone,
  validateHospitalisation,
  validateBirthGovernorat,
  validateBirthPostalCode,
  validateResidenceGovernorat,
  validateResidencePostalCode,
  validateExactAddress,
  validateRemarks,
  validateEmail,
  handleValidation,
];
