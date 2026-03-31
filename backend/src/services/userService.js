import {
  updateUserActivationStatus,
  getAllUsers,
  updateUserRole,
  getAllDoctors,
} from "../models/userModel.js";

/**
 * Récupère la liste de tous les utilisateurs
 * Réservé aux admins uniquement
 */
export const listAllUsers = async () => {
  const users = await getAllUsers();

  // Ne pas retourner les mots de passe
  return users.map((user) => {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};
/*
 * Réservé aux admins uniquement
 */
export const toggleUserActivation = async (userId, isactivated) => {
  const updatedUser = await updateUserActivationStatus(userId, isactivated);
  if (!updatedUser) {
    throw new Error("Utilisateur non trouvé");
  }

  // Ne pas retourner le mot de passe
  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};
// ── Service pour changer le rôle d'un utilisateur
export const changeUserRole = async (userId, role) => {
  if (!["patient", "medecin", "pharmacien", "analyste"].includes(role)) {
    throw new Error("Rôle invalide");
  }

  const updatedUser = await updateUserRole(userId, role);
  if (!updatedUser) {
    throw new Error("Utilisateur non trouvé");
  }

  return updatedUser;
};

// Service pour récupérer tous les médecins (pour les formulaires de sélection)
export const listAllDoctors = async () => {
  const doctors = await getAllDoctors();
  return doctors; // renvoie tableau [{id, nom, prenom, email}, ...]
};
//gestion du profil : update user info (nom, prenom, email, password)
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findUserById,
  updateUserInfo,
  updateUserPasswordById,
} from "../models/userModel.js";
import { sendPasswordConfirmationEmail } from "../utils/mailer.js";

// ── Mettre à jour les infos personnelles ──────────────────────────────────────
export const updateMyProfile = async (userId, { nom, prenom, email }) => {
  const updatedUser = await updateUserInfo(userId, { nom, prenom, email });
  if (!updatedUser) throw new Error("Utilisateur non trouvé");

  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

// ── Demande de changement de mot de passe (envoie l'email) ───────────────────
export const requestPasswordChange = async (
  userId,
  { currentPassword, newPassword },
) => {
  const user = await findUserById(userId);
  if (!user) throw new Error("Utilisateur non trouvé");

  // Vérifier le mot de passe actuel
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Mot de passe actuel incorrect");

  // Hacher le nouveau mot de passe
  const hashedNew = await bcrypt.hash(newPassword, 10);

  // Créer un token JWT signé (15 min) contenant le hash
  const token = jwt.sign(
    { userId, newHashedPassword: hashedNew, purpose: "pwd-change" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  // Construire l'URL de confirmation
  const confirmUrl = `${process.env.FRONTEND_URL}/confirm-password?token=${token}`;

  await sendPasswordConfirmationEmail({
    to: user.email,
    nom: user.nom,
    prenom: user.prenom,
    confirmUrl,
  });
};

// ── Confirmation via le lien email ────────────────────────────────────────────
export const confirmPasswordChange = async (token) => {
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new Error("Lien invalide ou expiré");
  }

  if (payload.purpose !== "pwd-change") {
    throw new Error("Token invalide");
  }

  const updatedUser = await updateUserPasswordById(
    payload.userId,
    payload.newHashedPassword,
  );
  if (!updatedUser) throw new Error("Utilisateur non trouvé");
};
