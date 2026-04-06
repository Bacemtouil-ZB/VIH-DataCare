import {
  findPatientIdByNumero,
  upsertPermission,
  findActivePermission,
  findPermissionByPatientId,
} from "../models/permissionModel.js";

// numero → patientId
export const resolvePatientId = async (numero) => {
  const patientId = await findPatientIdByNumero(numero);
  if (!patientId) throw new Error("Patient non trouvé");
  return patientId;
};

export const savePermission = async ({
  numero,
  medecinId,
  canViewViralLoad,
  canViewCd4,
  expiresAt,
}) => {
  try {
    const patientId = await resolvePatientId(numero);

    const permission = await upsertPermission({
      patientId,
      medecinId,
      canViewViralLoad,
      canViewCd4,
      expiresAt,
    });

    return permission;
  } catch (error) {
    console.error("Error saving permission:", error);
    throw new Error(error.message);
  }
};

export const fetchPermissionByNumero = async (numero) => {
  try {
    const patientId = await resolvePatientId(numero);
    const permission = await findPermissionByPatientId(patientId);
    return permission;
  } catch (error) {
    console.error("Error fetching permission:", error);
    throw new Error(error.message);
  }
};

export const fetchActivePermission = async (patientId) => {
  try {
    const permission = await findActivePermission(patientId);
    return permission;
  } catch (error) {
    console.error("Error fetching active permission:", error);
    throw new Error("Failed to fetch active permission");
  }
};