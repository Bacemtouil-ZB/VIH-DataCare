import { body, validationResult } from "express-validator";
import { verifyToken } from "../utils/jwt.js";
//authValidator
/**
 * Middleware pour valider les données de login
 */
export const validateLogin = [
  body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
  body("password").notEmpty().withMessage("Le mot de passe est requis"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


//authjwtMiddleware
export const protect = (req, res, next) => {
  // Get token from cookie OR Authorization header
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Use the verifyToken function from utils
    const decoded = verifyToken(token);
    req.user = decoded; // attach decoded user info to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
/* Middleware d'autorisation par rôle
 * @param {...string} allowedRoles 
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Vérifier que req.user existe (protect doit être appelé avant)
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "Accès non autorisé. Token manquant." 
      });
    }
    // Vérifier que le rôle de l'utilisateur est autorisé
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: `Accès refusé. Rôle '${req.user.role}' non autorisé.`,
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }
        // Vérifier que le compte est activé (sauf pour admin)
    if (req.user.role !== 'admin' && !req.user.isActivated) {
      return res.status(403).json({ 
        success: false,
        message: "Votre compte n'est pas activé. Veuillez contacter un administrateur." 
      });
    }

    next();
  };
};

// Middlewares d'autorisation pré-configurés
export const authorizePharmacien = authorize('pharmacien');
export const authorizeMedecin = authorize('medecin');
export const authorizeAnalyste = authorize('analyste');
export const authorizeAdmin = authorize('admin');

/**
 * Middleware pour valider les données d'inscription
 */
export const validateRegister = [
  body("nom")
    .trim()
    .notEmpty()
    .withMessage("Le nom est requis")
    .isLength({ min: 2, max: 50 })
    .withMessage("Le nom doit contenir entre 2 et 50 caractères"),
  body("prenom")
    .trim()
    .notEmpty()
    .withMessage("Le prénom est requis")
    .isLength({ min: 2, max: 50 })
    .withMessage("Le prénom doit contenir entre 2 et 50 caractères"),
  body("email")
    .isEmail()
    .withMessage("Email invalide")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    next();
  },
];
