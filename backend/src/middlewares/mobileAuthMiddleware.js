import jwt from "jsonwebtoken";
import { findMobileUserById } from "../models/mobile/mobileUserModel.js";
export const mobileProtect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé. Token manquant.",
      });
    }

    const token = authHeader.split(" ")[1];

    

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("DECODED:", decoded);

    const user = await findMobileUserById(decoded.id);
    // console.log("USER:", user);

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

    req.user = user;
    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    return res.status(401).json({
      success: false,
      message: "Token invalide ou expiré.",
    });
  }
};