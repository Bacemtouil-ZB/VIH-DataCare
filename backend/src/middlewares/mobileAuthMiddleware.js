import jwt from "jsonwebtoken";
import { findMobileUserById } from "../models/mobile/mobileUserModel.js";

export const mobileProtect = async (req, res, next) => {
  try {
    // Read token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé. Token manquant.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in DB
    const user = await findMobileUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé.",
      });
    }

    if (!user.isactivated) {
      return res.status(403).json({
        success: false,
        message: "Compte non activé.",
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token invalide ou expiré.",
    });
  }
};
