import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "../models/userModel.js";
import { generateToken } from "../utils/jwt.js";

// Register user
export const registerUser = async (email, password) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser(email, hashedPassword);

  return user;
};

// Login user
export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  // Generate JWT token
  const token = generateToken({ id: user.id, email: user.email }, "1h"); // 1 hour

  return { user, token };
};
