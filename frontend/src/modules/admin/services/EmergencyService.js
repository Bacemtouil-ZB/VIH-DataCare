// services/EmergencyService.js

import API from "../../../shared/utils/api";

const buildServiceError = (error, fallbackMessage) => {
  const payload = error?.response?.data;

  if (payload) {
    return {
      ...payload,
      message:
        payload.message ||
        payload.error ||
        error?.message ||
        fallbackMessage,
    };
  }

  return {
    message: error?.message || fallbackMessage,
  };
};

export const getEmergencyContacts = async () => {
  try {
    const res = await API.get("/emergency-contacts");
    return res.data;
  } catch (error) {
    throw buildServiceError(error, "Impossible de charger les contacts.");
  }
};

export const createEmergencyContact = async (data) => {
  try {
    const res = await API.post("/emergency-contacts", data);
    return res.data;
  } catch (error) {
    throw buildServiceError(error, "Erreur lors de l'ajout.");
  }
};

export const updateEmergencyContact = async (id, data) => {
  try {
    const res = await API.put(`/emergency-contacts/${id}`, data);
    return res.data;
  } catch (error) {
    throw buildServiceError(error, "Erreur lors de la modification.");
  }
};

export const deleteEmergencyContact = async (id) => {
  try {
    const res = await API.delete(`/emergency-contacts/${id}`);
    return res.data;
  } catch (error) {
    throw buildServiceError(error, "Erreur lors de la suppression.");
  }
};
