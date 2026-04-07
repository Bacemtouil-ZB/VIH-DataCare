// services/EmergencyService.js

import API from "../../../shared/utils/api";

export const getEmergencyContacts = async () => {
  const res = await API.get("/emergency-contacts");
  return res.data;
};

export const createEmergencyContact = async (data) => {
  const res = await API.post("/emergency-contacts", data);
  return res.data;
};

export const updateEmergencyContact = async (id, data) => {
  const res = await API.put(`/emergency-contacts/${id}`, data);
  return res.data;
};

export const deleteEmergencyContact = async (id) => {
  const res = await API.delete(`/emergency-contacts/${id}`);
  return res.data;
};