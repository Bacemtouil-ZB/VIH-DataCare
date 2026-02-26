import { body, validationResult } from "express-validator";
import { verifyToken } from "../utils/jwt.js";
import { findUserByEmail } from "../models/userModel.js";
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

/**
 * Middleware pour valider les données d'inscription
 */
export const validateRegister = (req, res, next) => {
  const { nom, prenom, email, password, role } = req.body;

  // Vérifier les champs obligatoires
  if (!nom || !prenom || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Tous les champs sont requis ",
    });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Format d'email invalide",
    });
  }
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Le mot de passe doit contenir au moins 8 caractères",
    });
  }
  if (role) {
    const validRoles = ["admin", "pharmacien", "medecin", "analyste"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message:
          "Rôle invalide. Valeurs acceptées : admin, pharmacien, medecin, analyste",
      });
    }
  }

  next();
};

/**
 * Middleware d'authentification - Vérifie le token JWT
 */
export const protect = async (req, res, next) => {
  try {
    // sécurité absolue
    if (!req.cookies || typeof req.cookies.token !== "string") {
      return res.status(401).json({
        success: false,
        message: "Non authentifié - Aucun token",
      });
    }

    const token = req.cookies.token;

    // vérifier token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return res.status(401).json({
        success: false,
        message: "Token invalide ou expiré",
      });
    }

    // récupérer utilisateur
    const user = await findUserByEmail(decoded.email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // enlever password
    const { password: _, ...safeUser } = user;
    req.user = safeUser;

    next();
  } catch (error) {
    console.error("Protect middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Erreur authentification",
    });
  }
};

/** Middleware d'autorisation - Admin uniquement
 */
export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Accès refusé - Réservé aux administrateurs",
    });
  }
  next();
};

/**
 * Middleware d'autorisation - Médecin uniquement
 */
export const authorizeMedecin = (req, res, next) => {
  if (req.user.role !== "medecin") {
    return res.status(403).json({
      success: false,
      message: "Accès refusé - Réservé aux médecins",
    });
  }
  next();
};

/**
 * Middleware d'autorisation - Pharmacien uniquement
 */
export const authorizePharmacien = (req, res, next) => {
  if (req.user.role !== "pharmacien") {
    return res.status(403).json({
      success: false,
      message: "Accès refusé - Réservé aux pharmaciens",
    });
  }
  next();
};

/**
 * Middleware d'autorisation - Analyste uniquement
 */
export const authorizeAnalyste = (req, res, next) => {
  if (req.user.role !== "analyste") {
    return res.status(403).json({
      success: false,
      message: "Accès refusé - Réservé aux analystes",
    });
  }
  next();
};
