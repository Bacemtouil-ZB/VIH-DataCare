import { body } from "express-validator";
import { handleValidation } from "./handleValidation.js";

// ─── Valeurs autorisées (miroir des enums SQL) ────────────────────────────────

const SITUATION_SOCIAL_VALUES = [
  "celibataire",
  "marie",
  "divorce",
  "veuf",
  "autre",
];

const NIVEAU_ETUDE_VALUES = [
  "sans_instruction",
  "primaire",
  "secondaire",
  "universite",
];

const ACTIVITE_PROFESSIONNELLE_VALUES = [
  "etudiant",
  "salarie",
  "sans_emploi",
  "retraite",
  "personne_au_foyer",
  "professionnelle_du_sexe",
];

const PROBLEME_VALUES = [
  "precarite_logement",
  "instabilite_professionnelle",
  "difficultes_financieres",
  "conflits_familiaux",
  "isolement_social",
  "violence_domestique",
  "problemes_transport",
  "difficulte_acces_soins",
];

// ─── Situation familiale (requis) ─────────────────────────────────────────────

const validateSituationSocial = body("situation_social")
  .trim()
  .notEmpty()
  .withMessage("La situation familiale est requise")
  .isIn(SITUATION_SOCIAL_VALUES)
  .withMessage("Situation familiale invalide")
  .custom((value) => {
    if (typeof value === "boolean" || typeof value === "number") {
      throw new Error("Type de valeur invalide");
    }
    return true;
  });

// ─── Niveau d'étude (requis) ──────────────────────────────────────────────────

const validateNiveauEtude = body("niveau_etude")
  .optional({ nullable: true, checkFalsy: true })
  .isIn(NIVEAU_ETUDE_VALUES)
  .withMessage("Niveau d'étude invalide")
  .custom((value) => {
    if (typeof value === "boolean" || typeof value === "number") {
      throw new Error("Type de valeur invalide");
    }
    return true;
  });

// ─── Activité professionnelle (requis) ───────────────────────────────────────

const validateActiviteProfessionnelle = body("activite_professionnelle")
  .optional({ nullable: true, checkFalsy: true })
  .isIn(ACTIVITE_PROFESSIONNELLE_VALUES)
  .withMessage("Activité professionnelle invalide")
  .custom((value) => {
    if (typeof value === "boolean" || typeof value === "number") {
      throw new Error("Type de valeur invalide");
    }
    return true;
  });

// ─── Nombre d'enfants (optionnel) ─────────────────────────────────────────────

const validateNombreEnfants = body("nombre_enfants")
  .optional({ nullable: true, checkFalsy: false })
  .custom((value) => {
    if (value === null || value === undefined || value === "") return true;

    // String envoyée à la place d'un nombre
    if (typeof value === "string" && isNaN(value)) {
      throw new Error("Le nombre d'enfants doit être un nombre");
    }

    const num = Number(value);

    // Float envoyé à la place d'un entier
    if (!Number.isInteger(num)) {
      throw new Error("Le nombre d'enfants doit être un entier");
    }

    // Valeur négative
    if (num < 0) {
      throw new Error("Le nombre d'enfants ne peut pas être négatif");
    }

    // Valeur extrême / irréaliste
    if (num > 50) {
      throw new Error("Valeur trop élevée pour le nombre d'enfants");
    }

    return true;
  });

// ─── Problèmes (optionnel - tableau d'enums) ──────────────────────────────────

const validateProbleme = body("probleme")
  .optional({ nullable: true, checkFalsy: true })
  .custom((value) => {
    if (!value) return true;

    // Doit être un tableau
    if (!Array.isArray(value)) {
      throw new Error(
        "Les problèmes doivent être envoyés sous forme de tableau",
      );
    }

    // Tableau trop grand
    if (value.length > PROBLEME_VALUES.length) {
      throw new Error("Trop de problèmes sélectionnés");
    }

    // Vérifier chaque valeur
    for (const item of value) {
      if (typeof item !== "string") {
        throw new Error("Chaque problème doit être une chaîne de caractères");
      }
      if (!PROBLEME_VALUES.includes(item)) {
        throw new Error(`Valeur invalide dans problèmes : ${item}`);
      }
    }

    // Doublons
    const unique = new Set(value);
    if (unique.size !== value.length) {
      throw new Error("Les problèmes ne peuvent pas contenir de doublons");
    }

    return true;
  });

// ─── Remarque (optionnel) ─────────────────────────────────────────────────────

const validateRemarque = body("remarque")
  .optional({ nullable: true, checkFalsy: true })
  .trim()
  .isLength({ max: 500 })
  .withMessage("La remarque ne peut pas dépasser 500 caractères")
  .custom((value) => {
    if (!value) return true;
    if (/\u0000|%00/.test(value)) throw new Error("Caractère interdit détecté");
    if (/<[^>]*>|javascript:|on\w+=|script/i.test(value)) {
      throw new Error("Entrée invalide détectée");
    }
    return true;
  });

// ─── Exports ──────────────────────────────────────────────────────────────────

export const validateCreateSocial = [
  validateSituationSocial,
  validateNiveauEtude,
  validateActiviteProfessionnelle,
  validateNombreEnfants,
  validateProbleme,
  validateRemarque,
  handleValidation,
];

export const validateUpdateSocial = [
  validateSituationSocial,
  validateNiveauEtude,
  validateActiviteProfessionnelle,
  validateNombreEnfants,
  validateProbleme,
  validateRemarque,
  handleValidation,
];
