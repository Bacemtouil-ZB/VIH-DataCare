import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "../models/userModel.js";
import { generateToken } from "../utils/jwt.js";

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

  // Ne pas retourner le mot de passe
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
