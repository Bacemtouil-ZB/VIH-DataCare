import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt.js";
import {
  findPatientUserByUsername,
  updateMustChangePassword,
  updatePatientPassword,
} from "../../models/mobile/mobileUserModel.js";
import { findPatientByUserId } from "../../models/mobile/mobilePatientModel.js";

export const mobileLoginService = async (username, password) => {
  console.log("1. username received:", username);
  console.log("2. password received:", password);

  const user1 = await findPatientUserByUsername(username);
  console.log("3. user found:", user1);

  if (user1) {
    const testCompare = await bcrypt.compare(password, user1.password);
    console.log("4. password match:", testCompare);
    console.log("5. hash in db:", user1.password);
  }
  // Find user by username
  const user = await findPatientUserByUsername(username);
  if (!user) {
    throw new Error("Identifiants invalides");
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Identifiants invalides");
  }

  // Check account is activated
  if (!user.isactivated) {
    throw new Error("Compte non activé");
  }

  // Generate JWT token
  const token = generateToken(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    "8h",
  );

  // Get patient profile
  const patient = await findPatientByUserId(user.id);

  return {
    token,
    mustChangePassword: user.must_change_password,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      name: patient?.name || null,
      surname: patient?.surname || null,
      numero: patient?.numero || null,
    },
  };
};

export const mobileChangePasswordService = async (userId, newPassword) => {
  if (!newPassword || newPassword.length < 8) {
    throw new Error("Le mot de passe doit contenir au moins 8 caractères");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  await updatePatientPassword(userId, hashedPassword);

  // Set must_change_password to false
  await updateMustChangePassword(userId, false);

  return {
    success: true,
    message: "Mot de passe mis à jour avec succès",
  };
};
