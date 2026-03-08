import API from "../../../shared/utils/api";

export const createRendezvous = async (data) => {
  try {
    const response = await API.post("/rendezvous/add", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getRendezvousByNumeroDossier = async (numeroDossier) => {
  try {
    const response = await API.get(`/rendezvous/patient/${numeroDossier}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getRendezvousById = async (id) => {
  try {
    const response = await API.get(`/rendezvous/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateRendezvous = async (id, data) => {
  try {
    const response = await API.put(`/rendezvous/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  createRendezvous,
  getRendezvousByNumeroDossier,
  getRendezvousById,
  updateRendezvous,
};
