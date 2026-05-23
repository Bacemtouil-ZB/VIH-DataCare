import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../utils/jwt.js";

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

import {
  sendUserCredentialsEmail,
  sendPasswordResetEmail,
} from "../utils/mailer.js";




export const registerUser = async (
  nom,
  prenom,
  email,
  password,
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

  const role = "medecin"; 

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser(
    nom,
    prenom,
    email,
    hashedPassword,
    role,
    false, 
  );

  // mail is sent asynchronously after response is sent to avoid blocking the registration flow
 setImmediate(() => {
    sendUserCredentialsEmail({ to: email, nom, prenom, role })
      .catch((error) =>
        console.error("Erreur envoi email identifiants:", error.message),
      );
  });
  const { password: _, ...userWithoutPassword } = user;  // Exclude password from returned user object
  return userWithoutPassword;
};




export const loginUser = async (email, password) => {
  // Vérifier si l'utilisateur existe
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Identifiants invalides");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("mot de passe incorrect");
  }

  const isActivated = Boolean(
    user.isactivated === true || user.isactivated === "t",
  );

  if (!isActivated) {
    throw new Error("Le compte est inactif,contactez l'administrateur");
  }

  // Générer un token JWT
  const token = generateToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      isActivated,
    },
    "8h",
  );
  const { password: _, ...userWithoutPassword } = user;

  //  Retourner user et token
  return {
    user: { ...userWithoutPassword, isactivated: isActivated },
    token,
  };
};





export const requestPasswordReset = async (email) => {
  if (!email) {
    throw new Error("Email requis");
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return {
      success: true,
      message: "Si cet email existe, un lien de reinitialisation a ete envoye.",
    };
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

  await deletePasswordResetsByUserId(user.id); // Supprimer les anciens
  await createPasswordReset(user.id, tokenHash, expiresAt);  

  const frontendBase = (
    process.env.FRONTEND_URL || "http://localhost:5173"
  ).replace(/\/$/, "");
  const resetUrl = `${frontendBase}/reset-password?token=${encodeURIComponent(rawToken)}`;

  // Return immediately, token is already saved in DB
  const result = {
    success: true,
    message: "Lien de reinitialisation envoye si cet email existe.",
  };

  // Send email non-blocking, after return value is ready
  sendPasswordResetEmail({
    to: user.email,
    nom: user.nom,
    prenom: user.prenom,
    resetUrl,
  }).catch((error) => {
    console.error("Erreur envoi email reset password:", error.message);
  });

  return result;
};




// this use after user get token from mail and submit new password with token, then we verify token and update password if valid
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
