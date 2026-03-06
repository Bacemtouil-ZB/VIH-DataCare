import API from "../../../shared/utils/api";

const normalizeItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export const getStockItems = async () => {
  try {
    const response = await API.get("/stock");
    return normalizeItems(response.data);
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createStockItem = async (payload) => {
  try {
    const response = await API.post("/stock", payload);
    return response.data?.item || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateStockQuantity = async (id, quantite) => {
  try {
    const response = await API.patch(`/stock/${id}/quantity`, { quantite });
    return response.data?.item || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteStockItem = async (id) => {
  try {
    const response = await API.delete(`/stock/${id}`);
    return response.data?.item || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getStockContextByNumero = async (numero) => {
  try {
    const response = await API.get(`/stock/context/${numero}`);
    return {
      patient: response.data?.patient || null,
      ordonnances: Array.isArray(response.data?.ordonnances) ? response.data.ordonnances : [],
    };
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  getStockItems,
  createStockItem,
  updateStockQuantity,
  deleteStockItem,
  getStockContextByNumero,
};

