import bcrypt from "bcryptjs";
import { findUserByEmail, createUser,updateUserActivationStatus ,getAllUsers } from "../models/userModel.js";
import { generateToken } from "../utils/jwt.js";

// Login user
export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials (mail)");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials (pw)");
  }
    // Vérifier si le compte est activé
  if (!user.isactivated) {
    throw new Error("Account is not activated");
  }
  if (user.role !== 'admin' && !user.isactivated) {
    throw new Error("Votre compte n'est pas encore activé. Veuillez contacter un administrateur.");
  }
  // Generate JWT token
  const token = generateToken({ 
    id: user.id, 
    email: user.email,
    role: user.role,
    isActivated: user.isactivated
  }, "30d");
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };  
};

// register sans role  
export const registerUser = async (nom, prenom, email, password) => {

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("Un utilisateur avec cet email existe déjà");
  }

  if (!nom || !prenom || !email || !password) {
    throw new Error("Tous les champs sont requis (nom, prenom, email, password)");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser(nom, prenom, email, hashedPassword, false);

  // Ne pas retourner le mot de passe
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
/**
 * Récupère la liste de tous les utilisateurs
 * Réservé aux admins uniquement
 */
export const listAllUsers = async (roleFilter = null) => {
  const users = await getAllUsers(roleFilter);
  
  // Ne pas retourner les mots de passe
  return users.map(user => {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};
/*
 * Réservé aux admins uniquement
 */
export const toggleUserActivation = async (userId, isActivated) => {
  const user = await findUserById(userId);
  // Mettre à jour le statut
  const updatedUser = await updateUserActivationStatus(userId, isActivated);
  
  // Ne pas retourner le mot de passe
  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};
