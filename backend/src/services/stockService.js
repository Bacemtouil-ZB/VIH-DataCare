import {
  listStockItems as listStockItemsModel,
  findStockItemById,
  createStockItem as createStockItemModel,
  updateStockQuantity as updateStockQuantityModel,
  deleteStockItem as deleteStockItemModel,
} from "../models/stockModel.js";

const normalizeCode = (value) => String(value || "").trim().toUpperCase();

const normalizeQuantity = (value) => {
  const q = Number(value);
  if (!Number.isInteger(q) || q < 0) {
    throw new Error("La quantité doit être un entier positif");
  }
  return q;
};

export const listStockItems = async () => {
  return listStockItemsModel();
};

export const createStockItem = async (payload, userId) => {
  const code = normalizeCode(payload?.code);
  const composition = String(payload?.composition || "").trim();
  const quantite = normalizeQuantity(payload?.quantite);

  if (!code) throw new Error("Le code du médicament est requis");
  if (!composition) throw new Error("La composition du médicament est requise");
  if (quantite <= 0) {
    throw new Error("La quantité initiale doit être strictement supérieure à 0");
  }

  try {
    return await createStockItemModel({ code, composition, quantite, userId });
  } catch (error) {
    if (error?.code === "23505") {
      throw new Error(`Un médicament avec le code ${code} existe déjà dans le stock`);
    }
    throw error;
  }
};

export const updateStockQuantity = async (id, quantite, userId) => {
  const stockId = parseInt(id, 10);
  if (!Number.isInteger(stockId) || stockId <= 0) {
    throw new Error("Identifiant de stock invalide");
  }

  const existing = await findStockItemById(stockId);
  if (!existing) {
    throw new Error("Article de stock introuvable");
  }

  const safeQuantity = normalizeQuantity(quantite);
  return updateStockQuantityModel(stockId, safeQuantity, userId);
};

export const deleteStockItem = async (id) => {
  const stockId = parseInt(id, 10);
  if (!Number.isInteger(stockId) || stockId <= 0) {
    throw new Error("Identifiant de stock invalide");
  }

  const existing = await findStockItemById(stockId);
  if (!existing) {
    throw new Error("Article de stock introuvable");
  }

  return deleteStockItemModel(stockId);
};

export const getStockItemById = async (id) => {
  const item = await findStockItemById(id);
  if (!item) {
    throw new Error("Article de stock introuvable");
  }
  return item;
};
