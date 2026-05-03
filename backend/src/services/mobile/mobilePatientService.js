import bcrypt from "bcryptjs";
import pool from "../../config/db.js";
import {
  checkPatientHasMobileAccount,
  linkPatientToUser,
  getPatientWithMobileAccount,
  findPatientByNumero,
} from "../../models/mobile/mobilePatientModel.js";
import {
  createPatientUser,
  findPatientUserByUsername,
} from "../../models/mobile/mobileUserModel.js";

const generateTempPassword = () => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"; 
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// 1 - Create mobile account
export const createMobileAccountService = async (numero, doctorId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const patient = await findPatientByNumero(numero);
    if (!patient) throw new Error("Patient non trouvé");

    const patientCheck = await checkPatientHasMobileAccount(patient.id);
    if (patientCheck.user_id) throw new Error("Ce patient possède déjà un accès mobile");

    const existingUser = await findPatientUserByUsername(patient.numero);
    if (existingUser) throw new Error("Un compte avec ce numéro existe déjà");

    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = await createPatientUser(patient.numero, hashedPassword);
    await linkPatientToUser(client, patient.id, newUser.id, doctorId);

    await client.query("COMMIT");

    return {
      success: true,
      credentials: {
        username: patient.numero,
        password: tempPassword,
        patientName: `${patient.name} ${patient.surname}`,
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// 2 - Reset mobile password
export const resetMobilePasswordService = async (numero) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const patient = await findPatientByNumero(numero);
    if (!patient) throw new Error("Patient non trouvé");

    const patientWithAccount = await getPatientWithMobileAccount(patient.id);
    if (!patientWithAccount.user_id) throw new Error("Ce patient n'a pas de compte mobile");

    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await client.query(
      `UPDATE users 
       SET password = $1, must_change_password = true, updated_at = NOW() 
       WHERE id = $2`,
      [hashedPassword, patientWithAccount.user_id]
    );

    await client.query("COMMIT");

    return {
      success: true,
      credentials: {
        username: patientWithAccount.username,
        password: tempPassword,
        patientName: `${patient.name} ${patient.surname}`,
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// 3 - Deactivate mobile account
export const deactivateMobileAccountService = async (numero) => {
  const patient = await findPatientByNumero(numero);
  if (!patient) throw new Error("Patient non trouvé");

  const patientWithAccount = await getPatientWithMobileAccount(patient.id);
  if (!patientWithAccount.user_id) throw new Error("Ce patient n'a pas de compte mobile");

  await pool.query(
    `UPDATE users SET isactivated = false, updated_at = NOW() WHERE id = $1`,
    [patientWithAccount.user_id]
  );

  return { success: true, message: "Accès mobile désactivé avec succès" };
};

// 4 - Get mobile account status
export const getMobileAccountStatusService = async (numero) => {
  const patient = await findPatientByNumero(numero);
  if (!patient) throw new Error("Patient non trouvé");

  const patientWithAccount = await getPatientWithMobileAccount(patient.id);

  return {
    hasMobileAccount: !!patientWithAccount.user_id,
    isActive: patientWithAccount.isactivated || false,
    username: patientWithAccount.username || null,
    mustChangePassword: patientWithAccount.must_change_password || false,
  };
};