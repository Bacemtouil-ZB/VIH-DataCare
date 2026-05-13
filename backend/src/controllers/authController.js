import {
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPasswordWithToken,
} from "../services/authService.js";
import { logAction } from "../services/auditService.js";


// Register controller
export const registerController = async (req, res) => {
  const { nom, prenom, email, password } = req.body;

  try {
    const user = await registerUser(nom, prenom, email, password);

    res.status(201).json({
      success: true,
      message:
        "Utilisateur cree avec succes. Votre compte doit etre active par un administrateur avant de pouvoir vous connecter.",
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        isActivated: user.isactivated,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Login controller
export const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {   //or
    return res.status(400).json({
      message: "Email et mot de passe sont requis",
    });
  }

  try {
    const { user, token } = await loginUser(email, password);

    res.cookie("token", token, { // save token in httpOnly cookie for security
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      maxAge: 8 * 60 * 60 * 1000,
    });

    await logAction(req, {
      module: "AUTH",
      action: "LOGIN_SUCCESS",
      user_id: user.id,
      user_role: user.role,
      entity_id: null,
      old_data: null,
      new_data: { email: user.email },
    });

    res.status(200).json({
      success: true,
      message: "Connexion reussie",
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        isActivated: user.isactivated,
      },
    });
  } catch (error) {
    await logAction(req, {
      module: "AUTH",
      action: "LOGIN_FAILED",
      user_id: null,
      user_role: null,
      entity_id: null,
      old_data: null,
      new_data: { email },
    });

    console.error("Login error:", error.message);
    res.status(401).json({ message: "Email ou mot de passe incorrect" });
  }
};

// Forgot password controller
export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;

  try {
    await requestPasswordReset(email);
    res.status(200).json({
      success: true,
      message: "Si cet email existe, un lien de reinitialisation a ete envoye.",
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Reset password controller
export const resetPasswordController = async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Les mots de passe ne correspondent pas",
    });
  }

  try {
    const result = await resetPasswordWithToken(token, password);
    res.status(200).json(result);
  } catch (error) {
    console.error("Reset password error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Logout controller
export const logoutController = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
    });

    res.status(200).json({
      success: true,
      message: "Deconnexion reussie",
    });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la deconnexion",
    });
  }
};

// get me used to get the current logged in user's info
export const getMe = (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      nom: req.user.nom,
      prenom: req.user.prenom,
      email: req.user.email,
      role: req.user.role,
      isActivated: req.user.isactivated,
    },
  });
};
