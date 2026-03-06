import {
  listStockItems as listStockItemsModel,
  findStockItemByCode,
  findStockItemById,
  createStockItem as createStockItemModel,
  updateStockQuantity as updateStockQuantityModel,
  deleteStockItem as deleteStockItemModel,
} from "../models/stockModel.js";
import { getPatientByNumero } from "../models/patientModel.js";
import { findMedicalTreatmentByNumeroDossier } from "../models/ordonnanceModel.js";

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

  const existing = await findStockItemByCode(code);
  if (existing) {
    throw new Error(`Le médicament ${code} existe déjà en stock`);
  }

  return createStockItemModel({ code, composition, quantite, userId });
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

// Utilisé quand la page reçoit /stock/:numero
export const getStockContextByNumero = async (numero) => {
  const patient = await getPatientByNumero(numero);
  if (!patient) {
    throw new Error(`Patient ${numero} non trouvé`);
  }

  const ordonnances = await findMedicalTreatmentByNumeroDossier(numero);
  return {
    patient,
    ordonnances: Array.isArray(ordonnances) ? ordonnances : [],
  };
};

