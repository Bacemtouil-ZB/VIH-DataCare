import { verifyToken } from "../utils/jwt.js";
import { findUserByEmail } from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    if (!req.cookies || typeof req.cookies.token !== "string") {
      return res.status(401).json({
        success: false,
        message: "Non authentifié - Aucun token",
      });
    }

    let decoded;
    try {
      decoded = verifyToken(req.cookies.token);
    } catch {
      return res.status(401).json({
        success: false,
        message: "Token invalide ou expiré",
      });
    }

    const user = await findUserByEmail(decoded.email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

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

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Accès refusé - Réservé aux administrateurs",
    });
  }
  next();
};

export const authorizeMedecin = (req, res, next) => {
  if (req.user.role !== "medecin") {
    return res.status(403).json({
      success: false,
      message: "Accès refusé - Réservé aux médecins",
    });
  }
  next();
};

export const authorizePharmacien = (req, res, next) => {
  if (req.user.role !== "pharmacien") {
    return res.status(403).json({
      success: false,
      message: "Accès refusé - Réservé aux pharmaciens",
    });
  }
  next();
};

export const authorizeAnalyste = (req, res, next) => {
  if (req.user.role !== "analyste") {
    return res.status(403).json({
      success: false,
      message: "Accès refusé - Réservé aux analystes",
    });
  }
  next();
};
