import {
  mobileLoginService,
  mobileChangePasswordService,
} from "../../services/mobile/mobileAuthService.js";

// POST /api/mobile/auth/login
export const mobileLoginController = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Identifiant et mot de passe sont requis",
    });
  }

  try {
    const result = await mobileLoginService(username, password);
    return res.status(200).json({
      success: true,
      message: "Connexion réussie",
      ...result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/mobile/auth/change-password
export const mobileChangePasswordController = async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({
      success: false,
      message: "Nouveau mot de passe requis",
    });
  }

  try {
    const result = await mobileChangePasswordService(req.user.id, newPassword);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/mobile/auth/me
export const mobileGetMeController = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

// POST /api/mobile/auth/logout
export const mobileLogoutController = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Déconnexion réussie",
  });
};
