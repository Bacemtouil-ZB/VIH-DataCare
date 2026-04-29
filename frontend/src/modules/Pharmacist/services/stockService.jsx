import API from "../../../shared/utils/api";

const normalizeItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

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
//getAll
export const getStockItems = async () => {
  try {
    const response = await API.get("/stock");
    return normalizeItems(response.data);
  } catch (error) {
    throw buildServiceError(error, "Erreur lors du chargement du stock.");
  }
};

export const createStockItem = async (payload) => {
  try {
    const response = await API.post("/stock/add", payload);
    return response.data?.item || response.data;
  } catch (error) {
    throw buildServiceError(error, "Erreur lors de l'ajout au stock.");
  }
};

export const updateStockQuantity = async (id, quantite) => {
  try {
    const response = await API.patch(`/stock/${id}/quantity`, { quantite });
    return response.data?.item || response.data;
  } catch (error) {
    throw buildServiceError(error, "Erreur lors de la mise a jour du stock.");
  }
};

export const deleteStockItem = async (id) => {
  try {
    const response = await API.delete(`/stock/${id}`);
    return response.data?.item || response.data;
  } catch (error) {
    throw buildServiceError(error, "Erreur lors de la suppression du stock.");
  }
};



export default {
  getStockItems,
  createStockItem,
  updateStockQuantity,
  deleteStockItem,
};
