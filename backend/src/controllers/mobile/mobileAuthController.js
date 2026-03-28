import {
  mobileLoginService,
  mobileChangePasswordService,
} from "../../services/mobile/mobileAuthService.js";
import { findPatientByUserId } from "../../models/mobile/mobilePatientModel.js";
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
  try {
    const patient = await findPatientByUserId(req.user.id);
    return res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        role: req.user.role,
        name: patient?.name || null,
        surname: patient?.surname || null,
        numero: patient?.numero || null,
        must_change_password: req.user.must_change_password,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/mobile/auth/logout
export const mobileLogoutController = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Déconnexion réussie",
  });
};
// used to save expo push token for the user to send notifications later
import { savePushToken } from '../../models/mobile/mobileUserModel.js';

// POST /api/mobile/patient/push-token
export const savePushTokenController = async (req, res) => {
  const { pushToken } = req.body;

  if (!pushToken) {
    return res.status(400).json({
      success: false,
      message: 'Push token requis',
    });
  }

  try {
    await savePushToken(req.user.id, pushToken);
    return res.status(200).json({
      success: true,
      message: 'Push token enregistré',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};