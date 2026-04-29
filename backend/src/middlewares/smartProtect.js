import jwt from "jsonwebtoken";
import { findMobileUserById } from "../models/mobile/mobileUserModel.js";
import { verifyToken } from "../utils/jwt.js";
import { findUserById } from "../models/userModel.js";
import pool from "../config/db.js";

export const smartProtect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const isMobile   = authHeader && authHeader.startsWith("Bearer ");

  // ── MOBILE ──────────────────────────
  if (isMobile) {
    try {
      const token   = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user    = await findMobileUserById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: "Utilisateur mobile non trouvé." });
      }

      if (!user.isactivated) {
        return res.status(403).json({ message: "Compte non activé." });
      }

      // ✅ 🔥 récupérer patient_id
      const result = await pool.query(
        "SELECT id FROM patients WHERE user_id = $1",
        [user.id]
      );

      req.user = {
        ...user,
        patient_id: result.rows[0]?.id || null,
      };

      req.isMobile = true;
      return next();

    } catch (error) {
      return res.status(401).json({ message: "Token mobile invalide ou expiré." });
    }
  }

  // ── WEB ─────────────────────────────
  try {
    if (!req.cookies || typeof req.cookies.token !== "string") {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const decoded = verifyToken(req.cookies.token);
    const user    = await findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Utilisateur web non trouvé." });
    }

    // ✅ 🔥 récupérer patient_id
    const result = await pool.query(
      "SELECT id FROM patients WHERE user_id = $1",
      [user.id]
    );

    const { password: _, ...safeUser } = user;

    req.user = {
      ...safeUser,
      patient_id: result.rows[0]?.id || null,
    };

    req.isMobile = false;
    return next();

  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
};