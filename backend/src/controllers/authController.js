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
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
      message: "Connexion réussie",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(401).json({ message: error.message });
  }
};

// Register controller
export const registerController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email et mot de passe sont requis",
    });
  }

  try {
    const user = await registerUser(email, password);
    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(400).json({ message: error.message });
  }
};
