import API from "../../../shared/utils/api";

export const getPermission = async (numero) => {
  const res = await API.get(`permissions/${numero}`);
  return res.data; // { success, data: permission | null }
};

export const setPermission = async ({
  numero,
  canViewViralLoad,
  canViewCd4,
  expiresAt,
}) => {
  const res = await API.post("permissions", {
    numero,
    canViewViralLoad,
    canViewCd4,
    expiresAt,
  });
  return res.data; // { success, data: permission }
};