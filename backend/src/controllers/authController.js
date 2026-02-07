import { loginUser, registerUser } from "../services/authService.js";

// Login controller
export const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email et mot de passe sont requis",
    });
  }

  try {
    const { user, token } = await loginUser(email, password);

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // mois
    });

    // Retourner aussi role et isActivated
    res.status(200).json({
      success: true,
      message: "Connexion réussie",
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
    console.error("Login error:", error.message);
    res.status(401).json({ message: error.message });
  }
};

/**
 * Contrôleur pour l'inscription
 */
export const registerController = async (req, res) => {
  const { nom, prenom, email, password, role } = req.body;

  try {
    const user = await registerUser(nom, prenom, email, password);

    res.status(201).json({
      success: true,
      message:
        "Utilisateur créé avec succès. Votre compte doit être activé par un administrateur avant de pouvoir vous connecter.",
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
    console.error(" Register error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
/**
 * Contrôleur pour la déconnexion
 */
export const logoutController = async (req, res) => {
  try {
    // Supprimer le cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({
      success: true,
      message: "Déconnexion réussie",
    });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la déconnexion",
    });
  }
};
export const getMe = (req, res) => {
  // req.user contient les infos décodées du token
  res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
    isActivated: req.user.isactivated,
  });
};
