
import {
  getMobileAccountStatusService,
  createMobileAccountService,
  resetMobilePasswordService,
  deactivateMobileAccountService,
} from "../../services/mobile/mobilePatientService.js";

// 1 - GET account status
export const getMobileAccountStatusController = async (req, res) => {
  try {
    const { numero } = req.params;
    const result = await getMobileAccountStatusService(numero);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    const statusCode = error.message.includes("non trouvé") ? 404 : 400;
    return res.status(statusCode).json({ success: false, message: error.message });
  }
};

// 2 - POST create account
export const createMobileAccountController = async (req, res) => {
  try {
    const { numero } = req.params;
    const doctorId = req.user.id;
    const result = await createMobileAccountService(numero, doctorId);
    return res.status(201).json(result);
  } catch (error) {
    const statusCode = error.message.includes("non trouvé") ? 404
      : error.message.includes("déjà") ? 409
      : 400;
    return res.status(statusCode).json({ success: false, message: error.message });
  }
};

// 3 - PUT reset password
export const resetMobilePasswordController = async (req, res) => {
  try {
    const { numero } = req.params;
    const result = await resetMobilePasswordService(numero);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// 4 - PUT deactivate account
export const deactivateMobileAccountController = async (req, res) => {
  try {
    const { numero } = req.params;
    const result = await deactivateMobileAccountService(numero);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};