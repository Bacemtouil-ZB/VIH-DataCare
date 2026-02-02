



import { body, param, query, validationResult } from "express-validator";
//Middleware pour valider la création d'un patient

export const validateCreatePatient = [
    body("name")
        .trim()
        .notEmpty()
        .isLength({ min: 2, max: 100 })
        .withMessage("Le prénom doit contenir entre 2 et 100 caractères"),

    body("surname")
        .trim()
        .notEmpty()
        .isLength({ min: 2, max: 100 })
        .withMessage("Le nom de famille doit contenir entre 2 et 100 caractères"),

    body("birthdate")
        .notEmpty()
        .isDate()
        .withMessage("La date de naissance doit être une date valide (YYYY-MM-DD)")
    ,

    body("gender")
        .notEmpty()
        .notEmpty()

    ,

    body("city")
        .trim()
        .notEmpty(),

    body("state")
        .trim()
        .notEmpty()
    ,

    body("postalcode")
        .trim()
        .notEmpty()
    ,

    body("nationality")
        .trim()
        .notEmpty()
    ,

    body("height")
        .optional()
        .isFloat({ min: 30, max: 300 })
        .withMessage("La taille doit être entre 30 et 300 cm"),

    body("modeoftransmission")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Le mode de transmission ne peut pas dépasser 100 caractères"),

    body("maritalstatus")
        .optional()
        .isIn(['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)'])
        .withMessage("Le statut marital doit être: Célibataire, Marié(e), Divorcé(e) ou Veuf(ve)"),

    body("numberchildren")

        .isInt({ min: 0 })
        .withMessage("Le nombre d'enfants doit être un entier positif"),

    body("educationlevel")
        .trim(),

    body("housing")
        .trim()

];

 //Middleware pour valider la mise à jour d'un patient

export const validateUpdatePatient = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("L'ID du patient doit être un entier valide"),

    body("name")

        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Le prénom doit contenir entre 2 et 100 caractères"),

    body("surname")

        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Le nom de famille doit contenir entre 2 et 100 caractères"),

    body("birthdate")

        .isDate()
        .withMessage("La date de naissance doit être une date valide (YYYY-MM-DD)"),

    body("gender")
        .trim(),
    body("city")

        .trim()
    ,

    body("state")
        .trim(),

    body("postalcode")
        .trim()
    ,

    body("nationality")
        .trim()
    ,

    body("height")

        .isFloat({ min: 30, max: 300 })
        .withMessage("La taille doit être entre 30 et 300 cm"),

    body("modeoftransmission")
        .trim()
    ,
    body("maritalstatus")

    ,
    body("numberchildren")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Le nombre d'enfants doit être un entier positif"),
    body("educationlevel")
        .trim(),
    body("housing")
        .trim()
    ,

];
