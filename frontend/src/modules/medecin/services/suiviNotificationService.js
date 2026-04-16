//cheked 15/04/2026
import API from "../../../shared/utils/api";
// Récupérer toutes les notifications RDV
export const getNotificationsRdv = async () => {
  try {
    const response = await API.get("/suivi-notifications");
    return response.data;
  } catch (error) {
    if (
      error.response?.status === 404 ||
      error.response?.status === 400
    ) {
      return [];
    }
    throw error;
  }
};

export const getDateEstimeeByNumero = async (numero) => {
  try {
    const response = await API.get(`/suivi-notifications/${numero}`);
    return response.data ?? null;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error;
  }
};