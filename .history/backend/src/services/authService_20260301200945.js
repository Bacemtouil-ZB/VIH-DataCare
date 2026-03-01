import bcrypt from "bcryptjs";
<<<<<<< HEAD
import { findUserByEmail, createUser } from "../models/userModel.js";
import { generateToken } from "../utils/jwt.js";
=======
import crypto from "crypto";
import {
  findUserByEmail,
  createUser,
  updateUserPasswordById,
} from "../models/userModel.js";
import {
  createPasswordReset,
  findValidPasswordResetByToken,
  deletePasswordResetsByUserId,
} from "../models/passwordResetModel.js";
import { generateToken } from "../utils/jwt.js";
import {
  sendUserCredentialsEmail,
  sendPasswordResetEmail,
} from "./mailService.js";
>>>>>>> feature/resetPassword

export const loginUser = async (email, password) => {
  // Vérifier si l'utilisateur existe
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Identifiants invalides");
  }

  // Vérifier le mot de passe
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("mot de passe incorrect");
  }

  // Vérifier si le compte est activé
  const isActivated = Boolean(
    user.isactivated === true || user.isactivated === "t",
  );

  if (!isActivated) {
    throw new Error("Account is not activated");
  }

  // Générer un token JWT
  const token = generateToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      isActivated,
    },
    "30d",
  );

  //  Supprimer le mot de passe avant retour
  const { password: _, ...userWithoutPassword } = user;

  //  Retourner user et token
  return {
    user: { ...userWithoutPassword, isactivated: isActivated },
    token,
  };
};

// register sans role
export const registerUser = async (
  nom,
  prenom,
  email,
  password,
  role = "medecin",
) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("Un utilisateur avec cet email existe déjà");
  }

  if (!nom || !prenom || !email || !password) {
    throw new Error(
      "Tous les champs sont requis (nom, prenom, email, password)",
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser(
    nom,
    prenom,
    email,
    hashedPassword,
    role,
    false,
  );

<<<<<<< HEAD
=======
  try {
    await sendUserCredentialsEmail({
      to: email,
      nom,
      prenom,
      password,
      role,
    });
  } catch (error) {
    console.error("Erreur envoi email identifiants:", error.message);
  }

>>>>>>> feature/resetPassword
  // Ne pas retourner le mot de passe
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
<<<<<<< HEAD
=======

export const requestPasswordReset = async (email) => {
  if (!email) {
    throw new Error("Email requis");
  }

  const user = await findUserByEmail(email);

  // Ne pas reveler si l'email existe ou non
  if (!user) {
    return {
      success: true,
      message:
        "Si cet email existe, un lien de reinitialisation a ete envoye.",
    };
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 min

  await deletePasswordResetsByUserId(user.id);
  await createPasswordReset(user.id, tokenHash, expiresAt);

  const frontendBase = (process.env.FRONTEND_URL || "http://localhost:5173").replace(
    /\/$/,
    "",
  );
  const resetUrl = `${frontendBase}/reset-password?token=${encodeURIComponent(rawToken)}`;

  try {
    await sendPasswordResetEmail({
      to: user.email,
      nom: user.nom,
      prenom: user.prenom,
      resetUrl,
    });
  } catch (error) {
    console.error("Erreur envoi email reset password:", error.message);
  }

  return {
    success: true,
    message: "Lien de reinitialisation envoye si cet email existe.",
  };
};

export const resetPasswordWithToken = async (token, password) => {
  if (!token || !password) {
    throw new Error("Token et mot de passe requis");
  }

  if (password.length < 8) {
    throw new Error("Le mot de passe doit contenir au moins 8 caracteres");
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const passwordReset = await findValidPasswordResetByToken(tokenHash);

  if (!passwordReset) {
    throw new Error("Lien invalide ou expire");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const updatedUser = await updateUserPasswordById(
    passwordReset.user_id,
    hashedPassword,
  );

  if (!updatedUser) {
    throw new Error("Utilisateur introuvable");
  }

  await deletePasswordResetsByUserId(passwordReset.user_id);

  return {
    success: true,
    message: "Mot de passe mis a jour avec succes",
  };
};
>>>>>>> feature/resetPassword
